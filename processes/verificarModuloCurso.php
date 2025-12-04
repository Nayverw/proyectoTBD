<?php
include("../conexion.php");
$id_curso = intval($_GET['id_curso'] ?? 0);

if (!$id_curso) {
    echo json_encode(["success"=>false,"error"=>"ID de curso inválido"]);
    exit;
}

$q = $conn->prepare("SELECT COUNT(*) as total FROM modulo WHERE id_curso=?");
$q->execute([$id_curso]);
$total = $q->fetch(PDO::FETCH_ASSOC)['total'];

echo json_encode(["success"=>true, "total"=>$total]);
?>
