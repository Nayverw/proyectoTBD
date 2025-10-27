<?php
header('Content-Type: application/json');
include("../conexion.php"); // Conexión a la base de datos

// Verificar si llega el parámetro
if (!isset($_GET['id_rol_usuario'])) {
    echo json_encode([
        "success" => false,
        "error" => "No se recibió id_rol_usuario"
    ]);
    exit();
}

$id_rol_usuario = intval($_GET['id_rol_usuario']);

// 🔹 Detectar si el usuario es estudiante o docente
$sqlRol = "
    SELECT r.nombre AS tipo_rol
    FROM ROL_USUARIO ru
    JOIN ROL r ON ru.id_rol = r.id_rol
    WHERE ru.id_rol_usuario = ?
";
$stmtRol = $conn->prepare($sqlRol);
$stmtRol->bind_param("i", $id_rol_usuario);
$stmtRol->execute();
$resultRol = $stmtRol->get_result();

if ($resultRol->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "error" => "No se encontró el rol del usuario especificado."
    ]);
    exit();
}

$tipo_rol = $resultRol->fetch_assoc()['tipo_rol'];
$stmtRol->close();

// 🔹 Dependiendo del rol, armamos la consulta
if (strtoupper($tipo_rol) === 'ESTUDIANTE') {
    // Consulta para estudiantes: cursos activos y progreso
    $sql = "
        SELECT 
            tc.nombre_curso,
            i.progreso,
            c.estado
        FROM 
            INSCRIPCION i
        JOIN 
            CURSO c ON i.id_curso = c.id_curso
        JOIN 
            TIPO_CURSO tc ON c.id_tipo_curso = tc.id_tipo_curso
        WHERE 
            i.id_rol_usuario = ?
            AND c.estado = 'ACTIVO'
        ORDER BY 
            tc.nombre_curso ASC
    ";
} elseif (strtoupper($tipo_rol) === 'DOCENTE') {
    // Consulta para docentes: cursos activos que imparte
    $sql = "
        SELECT 
            tc.nombre_curso,
            c.estado
        FROM 
            CURSO c
        JOIN 
            TIPO_CURSO tc ON c.id_tipo_curso = tc.id_tipo_curso
        WHERE 
            c.id_docente = ?
            AND c.estado = 'ACTIVO'
        ORDER BY 
            tc.nombre_curso ASC
    ";
} else {
    echo json_encode([
        "success" => false,
        "error" => "El tipo de rol no es válido (solo se admite ESTUDIANTE o DOCENTE)."
    ]);
    exit();
}

// Ejecutar consulta de cursos
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_rol_usuario);
$stmt->execute();
$result = $stmt->get_result();

$cursos = [];
while ($row = $result->fetch_assoc()) {
    $cursoData = [
        "nombre_curso" => $row["nombre_curso"],
        "estado" => $row["estado"]
    ];

    // Solo los estudiantes tienen progreso
    if (isset($row["progreso"])) {
        $cursoData["progreso"] = $row["progreso"];
    }

    $cursos[] = $cursoData;
}

// 🔹 Devolver resultado
if (count($cursos) > 0) {
    echo json_encode([
        "success" => true,
        "rol" => $tipo_rol,
        "cursos" => $cursos
    ]);
} else {
    echo json_encode([
        "success" => false,
        "rol" => $tipo_rol,
        "mensaje" => "No se encontraron cursos activos para este usuario."
    ]);
}

$stmt->close();
$conn->close();
?>