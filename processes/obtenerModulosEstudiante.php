<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 1);
error_reporting(E_ALL);

include_once("../conexion.php");

if (!isset($_GET['id_curso']) || !isset($_GET['id_usuario'])) {
    echo json_encode(["success"=>false,"error"=>"Faltan parámetros"]);
    exit;
}

$idCurso = intval($_GET['id_curso']);
$idUsuario = intval($_GET['id_usuario']);

$sql = "SELECT m.id_modulo, m.nombre, m.valor_puntos,
        IFNULL(p.progreso,0) AS progreso
        FROM modulo m
        LEFT JOIN progreso_modulo p 
          ON m.id_modulo = p.id_modulo AND p.id_usuario = ?
        WHERE m.id_curso = ?";

$stmt = $conn->prepare($sql);
if(!$stmt) {
    echo json_encode(["success"=>false,"error"=>"Error prepare: ".$conn->error]);
    exit;
}

$stmt->bind_param("ii",$idUsuario,$idCurso);
$stmt->execute();
$result = $stmt->get_result();

$modulos = [];
while($row = $result->fetch_assoc()){
    $modulos[] = $row;
}

echo json_encode(["success"=>true,"modulos"=>$modulos]);
exit;
?>
