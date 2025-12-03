<?php
// =======================
// cargarHome.php
// =======================

// Forzar solo salida JSON
header('Content-Type: application/json');
ini_set('display_errors', 0);
error_reporting(0);

include("../conexion.php");

// 🔹 Validar parámetro obligatorio
if (!isset($_GET['id_rol_usuario'])) {
    echo json_encode([
        "success" => false,
        "error" => "No se recibió id_rol_usuario"
    ]);
    exit;
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
    $stmtRol->close();
    $conn->close();
    exit;
}

$tipo_rol = strtoupper($resultRol->fetch_assoc()['tipo_rol']);
$stmtRol->close();

// 🔹 Responder según rol
if ($tipo_rol === 'ESTUDIANTE') {

    // Cursos en los que está inscrito
    $sql = "
        SELECT 
            c.id_curso,
            tc.nombre_curso,
            i.progreso,
            c.estado
        FROM INSCRIPCION i
        JOIN CURSO c ON i.id_curso = c.id_curso
        JOIN TIPO_CURSO tc ON c.id_tipo_curso = tc.id_tipo_curso
        WHERE i.id_rol_usuario = ?
          AND c.estado = 'ACTIVO'
        ORDER BY tc.nombre_curso ASC
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

    // Cursos disponibles (no inscritos)
    $sqlDisp = "
        SELECT c.id_curso, tc.nombre_curso, c.estado
        FROM CURSO c
        JOIN TIPO_CURSO tc ON c.id_tipo_curso = tc.id_tipo_curso
        WHERE c.estado = 'ACTIVO'
          AND c.id_curso NOT IN (
              SELECT id_curso FROM INSCRIPCION WHERE id_rol_usuario = ?
          )
        ORDER BY tc.nombre_curso ASC
    ";
    $stmtDisp = $conn->prepare($sqlDisp);
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

    echo json_encode([
        "success" => true,
        "rol" => "ESTUDIANTE",
        "cursos_inscritos" => $cursos_inscritos,
        "cursos_disponibles" => $cursos_disponibles
    ]);

} elseif ($tipo_rol === 'DOCENTE') {

    // Cursos que dicta el docente
    $sql = "
        SELECT c.id_curso, tc.nombre_curso, c.estado
        FROM CURSO c
        JOIN TIPO_CURSO tc ON c.id_tipo_curso = tc.id_tipo_curso
        WHERE c.id_docente = ?
          AND c.estado = 'ACTIVO'
        ORDER BY tc.nombre_curso ASC
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
        "error" => "El tipo de rol no es válido (solo ESTUDIANTE o DOCENTE)."
    ]);
}

$conn->close();
