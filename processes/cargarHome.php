<?php
header('Content-Type: application/json');
include("../conexion.php"); // Conexión a la base de datos

// 🔹 Verificar parámetro obligatorio
if (!isset($_GET['id_rol_usuario'])) {
    echo json_encode([
        "success" => false,
        "error" => "No se recibió id_rol_usuario"
    ]);
    exit();
}

$id_rol_usuario = intval($_GET['id_rol_usuario']);

// 🔹 Obtener el tipo de rol del usuario
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

$tipo_rol = strtoupper($resultRol->fetch_assoc()['tipo_rol']);
$stmtRol->close();

// 🔹 Armar la consulta según el rol
if ($tipo_rol === 'ESTUDIANTE') {
    // Cursos en los que está inscrito el estudiante
    $sql = "
        SELECT 
            c.id_curso,
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

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_rol_usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    $cursos_inscritos = [];
    while ($row = $result->fetch_assoc()) {
        $cursos_inscritos[] = [
            "id_curso" => $row["id_curso"],
            "nombre_curso" => $row["nombre_curso"],
            "progreso" => $row["progreso"],
            "estado" => $row["estado"]
        ];
    }
    $stmt->close();

    // 🔹 Cursos disponibles (a los que NO está inscrito)
    $sqlDisponibles = "
        SELECT 
            c.id_curso,
            tc.nombre_curso,
            c.estado
        FROM 
            CURSO c
        JOIN 
            TIPO_CURSO tc ON c.id_tipo_curso = tc.id_tipo_curso
        WHERE 
            c.estado = 'ACTIVO'
            AND c.id_curso NOT IN (
                SELECT id_curso FROM INSCRIPCION WHERE id_rol_usuario = ?
            )
        ORDER BY 
            tc.nombre_curso ASC
    ";

    $stmtDisp = $conn->prepare($sqlDisponibles);
    $stmtDisp->bind_param("i", $id_rol_usuario);
    $stmtDisp->execute();
    $resultDisp = $stmtDisp->get_result();

    $cursos_disponibles = [];
    while ($row = $resultDisp->fetch_assoc()) {
        $cursos_disponibles[] = [
            "id_curso" => $row["id_curso"],
            "nombre_curso" => $row["nombre_curso"],
            "estado" => $row["estado"]
        ];
    }
    $stmtDisp->close();

    // 🔹 Devolver ambos
    echo json_encode([
        "success" => true,
        "rol" => "ESTUDIANTE",
        "cursos_inscritos" => $cursos_inscritos,
        "cursos_disponibles" => $cursos_disponibles
    ]);

} elseif ($tipo_rol === 'DOCENTE') {
    // Cursos que imparte el docente
    $sql = "
        SELECT 
            c.id_curso,
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

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_rol_usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    $cursos_docente = [];
    while ($row = $result->fetch_assoc()) {
        $cursos_docente[] = [
            "id_curso" => $row["id_curso"],
            "nombre_curso" => $row["nombre_curso"],
            "estado" => $row["estado"]
        ];
    }
    $stmt->close();

    echo json_encode([
        "success" => true,
        "rol" => "DOCENTE",
        "cursos" => $cursos_docente
    ]);

} else {
    echo json_encode([
        "success" => false,
        "error" => "El tipo de rol no es válido (solo se admite ESTUDIANTE o DOCENTE)."
    ]);
}

$conn->close();
?>

inscribirseCurso.php

<?php
header('Content-Type: application/json');
include("../conexion.php");

// 🔹 Obtener datos del formulario (enviados por JS)
$id_curso = intval($_POST['id_curso'] ?? 0);
$id_rol_usuario = intval($_POST['id_rol_usuario'] ?? 0);

if (!$id_curso || !$id_rol_usuario) {
    echo json_encode(["success" => false, "mensaje" => "Datos incompletos."]);
    exit();
}

// 🔹 Verificar si ya está inscrito
$sqlCheck = "SELECT * FROM inscripcion WHERE id_curso = ? AND id_rol_usuario = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("ii", $id_curso, $id_rol_usuario);
$stmtCheck->execute();
$result = $stmtCheck->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "mensaje" => "Ya estás inscrito en este curso."]);
    exit();
}
$stmtCheck->close();

// 🔹 Datos obligatorios para insertar
$fecha_inscripcion = date("Y-m-d H:i:s");
$fecha_finalizacion = null;
$costo = 0; // Puedes ajustarlo más adelante según curso
$modalidad = "Online"; // Valor por defecto
$progreso = 0;
$estado = "Activo";

// 🔹 Insertar en la tabla INSCRIPCION
$sqlInsert = "
    INSERT INTO inscripcion 
    (fecha_inscripcion, fecha_finalizacion, costo, modalidad, progreso, estado, id_curso, id_rol_usuario)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
";
$stmt = $conn->prepare($sqlInsert);
$stmt->bind_param(
    "ssidsdii",
    $fecha_inscripcion,
    $fecha_finalizacion,
    $costo,
    $modalidad,
    $progreso,
    $estado,
    $id_curso,
    $id_rol_usuario
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "mensaje" => "✅ Inscripción exitosa al curso."]);
} else {
    echo json_encode(["success" => false, "mensaje" => "❌ Error al inscribirse: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
