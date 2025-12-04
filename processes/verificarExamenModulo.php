<?php
include("../conexion.php");
$id_modulo = intval($_GET['id_modulo'] ?? 0);

if (!$id_modulo) {
    echo json_encode(["success"=>false,"error"=>"ID de módulo inválido"]);
    exit;
}

$q = $conn->prepare("SELECT COUNT(*) as total FROM examen WHERE id_modulo=?");
$q->execute([$id_modulo]);
$total = $q->fetch(PDO::FETCH_ASSOC)['total'];

echo json_encode(["success"=>true, "existe"=>$total>0]);
?>
