<?php
header('Content-Type: application/json');
include_once("../conexion.php");

if(!isset($_POST['id_modulo'], $_POST['nombre_modulo'], $_POST['valor_puntos'])){
    echo json_encode(["success"=>false, "error"=>"Datos incompletos"]);
    exit;
}

$id_modulo = intval($_POST['id_modulo']);
$nombre = trim($_POST['nombre_modulo']);
$valor_puntos = floatval($_POST['valor_puntos']);

$sql = "UPDATE MODULO SET nombre = ?, valor_puntos = ? WHERE id_modulo = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sdi", $nombre, $valor_puntos, $id_modulo);

if($stmt->execute()){
    echo json_encode(["success"=>true, "mensaje"=>"Módulo actualizado"]);
} else {
    echo json_encode(["success"=>false, "error"=>"Error al actualizar módulo"]);
}
?>
