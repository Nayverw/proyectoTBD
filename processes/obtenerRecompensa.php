<?php
require_once("../conexion.php");

$idRecompensa = intval($_GET['id_recompensa'] ?? 0);

if ($idRecompensa <= 0) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT id_recompensa, nombre, precio_puntos, descuento, id_tipo_recompensa
        FROM RECOMPENSA
        WHERE id_recompensa = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idRecompensa);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows == 0) {
    echo json_encode([]);
    exit;
}

$row = $res->fetch_assoc();
echo json_encode($row);
?>