<?php
header('Content-Type: application/json');
include("../conexion.php");

$id_modulo = intval($_GET["id_modulo"]);

$q = $con->prepare("SELECT COUNT(*) c FROM examen WHERE id_modulo = ?");
$q->bind_param("i", $id_modulo);
$q->execute();
$q->bind_result($c);
$q->fetch();
$q->close();

echo json_encode(["existe" => $c > 0]);
