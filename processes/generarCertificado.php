<?php
header('Content-Type: application/json');
include("../conexion.php");

$id = intval($_POST["id_inscripcion"] ?? 0);

$q = $con->prepare("UPDATE inscripcion SET estado='FINALIZADO', fecha_finalizacion=NOW() WHERE id_inscripcion=?");
$q->bind_param("i",$id);
$q->execute();

echo json_encode(["success"=>true, "mensaje"=>"Curso finalizado, certificado generado"]);
