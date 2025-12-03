<?php
header('Content-Type: application/json');
include_once("../conexion.php");

if(!isset($_POST['id_curso'], $_POST['nombre_modulo'], $_POST['valor_puntos'])){
    echo json_encode(["success"=>false, "error"=>"Datos incompletos"]);
    exit;
}

$id_curso = intval($_POST['id_curso']);
$nombre = trim($_POST['nombre_modulo']);
$valor_puntos = floatval($_POST['valor_puntos']);

$sql = "INSERT INTO MODULO (nombre, valor_puntos, id_curso) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sdi", $nombre, $valor_puntos, $id_curso);

if($stmt->execute()){
    echo json_encode(["success"=>true, "mensaje"=>"Módulo creado"]);
} else {
    echo json_encode(["success"=>false, "error"=>"Error al crear módulo"]);
}
?>
