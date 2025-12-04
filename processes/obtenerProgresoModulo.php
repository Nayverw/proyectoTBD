<?php
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");

$id_modulo = intval($_GET['id_modulo'] ?? 0);
$id_usuario = intval($_GET['id_usuario'] ?? 0);

if (!$id_modulo || !$id_usuario) {
    echo json_encode(["success"=>false, "progreso"=>0]);
    exit;
}

// ejemplo de consulta
$stmt = $conn->prepare("SELECT porcentaje FROM progreso_modulo WHERE id_modulo=? AND id_usuario=?");
$stmt->bind_param("ii", $id_modulo, $id_usuario);
$stmt->execute();
$res = $stmt->get_result();
$progreso = 0;
if ($row = $res->fetch_assoc()) {
    $progreso = (float)$row['porcentaje'];
}

echo json_encode(["success"=>true, "progreso"=>$progreso]);
exit;
