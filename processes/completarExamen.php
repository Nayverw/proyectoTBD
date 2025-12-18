<?php
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");

$id_usuario = intval($_POST['id_usuario'] ?? 0);
$id_examen  = intval($_POST['id_examen'] ?? 0);
$id_modulo  = intval($_POST['id_modulo'] ?? 0);

if (!$id_usuario || !$id_examen || !$id_modulo) {
    echo json_encode(["success"=>false, "error"=>"Parámetros inválidos"]);
    exit;
}

// Insertar examen como COMPLETADO o actualizar si ya existe
$stmt = $conn->prepare("
    INSERT INTO examen_realizado (id_usuario, id_examen, id_modulo, estado, fecha_realizado)
    VALUES (?, ?, ?, 'COMPLETADO', NOW())
    ON DUPLICATE KEY UPDATE estado='COMPLETADO', fecha_realizado=NOW()
");
$stmt->bind_param("iii", $id_usuario, $id_examen, $id_modulo);

if ($stmt->execute()) {
    echo json_encode(["success"=>true]);
} else {
    echo json_encode(["success"=>false, "error"=>$stmt->error]);
}
exit;
