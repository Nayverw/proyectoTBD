<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

$data = json_decode(file_get_contents("php://input"), true);

// Si estás usando FormData desde JS, entonces usa $_POST:
$id = intval($_POST['id_recompensa'] ?? 0);

if (!$id) {
    echo json_encode(['success'=>false,'error'=>'ID inválido']);
    exit;
}

$sql = $conn->prepare("DELETE FROM recompensa WHERE id_recompensa=?");
if (!$sql) {
    echo json_encode(['success'=>false,'error'=>'Error prepare: '.$conn->error]);
    exit;
}
$sql->bind_param("i", $id);

if ($sql->execute()) {
    echo json_encode(['success'=>true,'mensaje'=>'Recompensa eliminada']);
} else {
    echo json_encode(['success'=>false,'error'=>$sql->error]);
}

$sql->close();
$conn->close();
?>
