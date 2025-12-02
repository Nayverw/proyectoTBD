<?php
// C:\xampp\htdocs\proyectoTBD\processes\ForosPreguntasCargar.php
header("Content-Type: application/json");

// Validación
if (!isset($_POST['id_foro'])) {
    echo json_encode(["error" => "No se recibió id_foro"]);
    exit;
}

$idForo = intval($_POST['id_foro']);

require_once "../conexion.php";

// Obtener preguntas del foro
$query = $conn->prepare("SELECT id_pregunta_foro, descripcion, fecha FROM PREGUNTA_FORO WHERE id_foro = ? ORDER BY fecha DESC");
$query->bind_param("i", $idForo);
$query->execute();
$result = $query->get_result();

$preguntas = [];
while ($row = $result->fetch_assoc()) {
    $preguntas[] = $row;
}

echo json_encode($preguntas);