<?php
include("../conexion.php");
$id_inscripcion = intval($_GET['id_inscripcion']);
if(!$id_inscripcion) { echo json_encode(["success"=>false,"error"=>"ID inválido"]); exit; }

$q = $conn->prepare("
    SELECT COUNT(*) as total, SUM(CASE WHEN estado='COMPLETO' THEN 1 ELSE 0 END) as completos
    FROM progreso_modulo
    WHERE id_inscripcion=?
");
$q->execute([$id_inscripcion]);
$res = $q->fetch(PDO::FETCH_ASSOC);

$completo = $res['total']>0 && $res['total']==$res['completos'];
echo json_encode(["success"=>true,"completo"=>$completo]);
?>
