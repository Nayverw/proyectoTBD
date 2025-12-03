<?php
header("Content-Type: application/json");
include("../conexion.php");

$sql = "
    SELECT h.id_horario, h.dia, h.hora, h.valor_puntos, h.id_curso, h.id_aula, a.nombre AS aula_nombre
    FROM horario h
    LEFT JOIN aula a ON h.id_aula = a.id_aula
    ORDER BY h.dia ASC, h.hora ASC
";
$result = $conn->query($sql);

$horarios = [];
while ($row = $result->fetch_assoc()) {
    $horarios[] = $row;
}

echo json_encode(["horarios" => $horarios]);
$conn->close();
?>
