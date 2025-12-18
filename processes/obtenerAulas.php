<?php
header('Content-Type: application/json');
require_once("../conexion.php");

$sql = "
    SELECT 
        id_aula,
        nombre,
        ubicacion,
        descripcion
    FROM aula
    WHERE disponible = 1
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "error" => $conn->error
    ]);
    exit;
}

$aulas = [];

while ($row = $result->fetch_assoc()) {
    $aulas[] = $row;
}

echo json_encode([
    "success" => true,
    "aulas" => $aulas
]);

$conn->close();
