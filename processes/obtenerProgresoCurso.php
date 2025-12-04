<?php
header('Content-Type: application/json');
include("../conexion.php");

$id_usuario = intval($_GET["id_usuario"] ?? 0);
$id_curso = intval($_GET["id_curso"] ?? 0);

// total módulos
$q = $con->prepare("SELECT COUNT(*) c FROM modulo WHERE id_curso = ?");
$q->bind_param("i",$id_curso);
$q->execute();
$q->bind_result($m);
$q->fetch();
$q->close();

// módulos completados
$q = $con->prepare("
SELECT COUNT(*) c 
FROM progreso_modulo pm
JOIN inscripcion i ON i.id_inscripcion=pm.id_inscripcion
WHERE i.id_curso=? AND i.id_rol_usuario=? AND pm.estado='COMPLETADO'");
$q->bind_param("ii",$id_curso,$id_usuario);
$q->execute();
$q->bind_result($c);
$q->fetch();
$q->close();

$porcentaje = ($m>0) ? round( ($c/$m) * 100, 2 ) : 0;

echo json_encode(["success"=>true, "progreso"=>$porcentaje]);
