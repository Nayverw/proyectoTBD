<?php
header("Content-Type: application/json");
include("../conexion.php");

$sql = "SELECT id_aula, nombre, ubicacion, descripcion, disponible FROM aula ORDER BY nombre ASC";
$result = $conn->query($sql);

$aulas = [];
while ($row = $result->fetch_assoc()) {
    $aulas[] = $row;
}

echo json_encode(["aulas" => $aulas]);
$conn->close();
?>
