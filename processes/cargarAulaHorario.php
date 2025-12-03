<?php
header('Content-Type: application/json');
include("../conexion.php");

$dia = $_GET['dia'] ?? "";
$hora = $_GET['hora'] ?? "";

// 🔹 Aulas que NO estén ocupadas en el horario solicitado
$sqlAulas = "
    SELECT a.*
    FROM aula a
    WHERE a.id_aula NOT IN (
        SELECT h.id_aula
        FROM horario h
        WHERE h.dia = ? AND h.hora = ?
    )
    AND a.disponible = 1
";

$stmt = $conn->prepare($sqlAulas);
$stmt->bind_param("ss", $dia, $hora);
$stmt->execute();
$res = $stmt->get_result();
$aulas = [];

while ($row = $res->fetch_assoc()) {
    $aulas[] = $row;
}

echo json_encode([
    "success" => true,
    "aulas" => $aulas
]);
?>
