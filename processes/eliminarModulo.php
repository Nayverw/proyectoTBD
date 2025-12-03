<?php
header('Content-Type: application/json');
include_once("../conexion.php");

if(!isset($_POST['id_modulo'])){
    echo json_encode(["success"=>false, "error"=>"No se indicó módulo"]);
    exit;
}

$id_modulo = intval($_POST['id_modulo']);

// Opcional: revisar si hay progreso registrado antes de eliminar
$sqlCheck = "SELECT COUNT(*) as count FROM PROGRESO_MODULO WHERE id_modulo = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("i", $id_modulo);
$stmtCheck->execute();
$resultCheck = $stmtCheck->get_result()->fetch_assoc();
if($resultCheck['count'] > 0){
    echo json_encode(["success"=>false, "error"=>"No se puede eliminar, hay progreso registrado."]);
    exit;
}

$sql = "DELETE FROM MODULO WHERE id_modulo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_modulo);

if($stmt->execute()){
    echo json_encode(["success"=>true, "mensaje"=>"Módulo eliminado"]);
} else {
    echo json_encode(["success"=>false, "error"=>"Error al eliminar módulo"]);
}
?>
