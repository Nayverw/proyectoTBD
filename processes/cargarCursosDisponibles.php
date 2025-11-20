<?php
header('Content-Type: application/json');
include("../conexion.php");

// 🔹 Obtener id del usuario
$id_rol_usuario = intval($_GET['id_rol_usuario'] ?? 0);
if (!$id_rol_usuario) {
    echo json_encode(["success" => false, "mensaje" => "Falta id_rol_usuario"]);
    exit();
}

// 🔹 Traer cursos que el estudiante ya tiene inscritos
$sqlInscritos = "
    SELECT tc.id_tipo_curso, tc.nombre_curso, tc.curso_extra
    FROM inscripcion i
    JOIN tipo_curso tc ON i.id_curso = tc.id_tipo_curso
    WHERE i.id_rol_usuario = ?
";
$stmtIns = $conn->prepare($sqlInscritos);
$stmtIns->bind_param("i", $id_rol_usuario);
$stmtIns->execute();
$resultIns = $stmtIns->get_result();
$cursosInscritos = [];
while ($row = $resultIns->fetch_assoc()) {
    $cursosInscritos[] = $row;
}
$stmtIns->close();

// 🔹 Traer cursos disponibles que no esté inscrito
$sqlDisponibles = "
    SELECT id_tipo_curso, nombre_curso, curso_extra
    FROM tipo_curso
    WHERE id_tipo_curso NOT IN (
        SELECT id_curso FROM inscripcion WHERE id_rol_usuario = ?
    )
";
$stmtDisp = $conn->prepare($sqlDisponibles);
$stmtDisp->bind_param("i", $id_rol_usuario);
$stmtDisp->execute();
$resultDisp = $stmtDisp->get_result();
$cursosDisponibles = [];
while ($row = $resultDisp->fetch_assoc()) {
    $cursosDisponibles[] = $row;
}
$stmtDisp->close();
$conn->close();

// 🔹 Devolver todo en JSON
echo json_encode([
    "success" => true,
    "cursos_inscritos" => $cursosInscritos,
    "cursos_disponibles" => $cursosDisponibles
]);
?>
