<?php
// C:\xampp\htdocs\proyectoTBD\processes\ForosRespuestasCargar.php
header("Content-Type: application/json");

// Validación
if (!isset($_POST['id_pregunta_foro'])) {
    echo json_encode(["error" => "No se recibió id_pregunta_foro"]);
    exit;
}

$idPregunta = intval($_POST['id_pregunta_foro']);

require_once "../conexion.php";

$query = $conn->prepare("SELECT descripcion, fecha FROM RESPUESTA_PREGUNTA WHERE id_pregunta_foro = ? ORDER BY fecha ASC");
$query->bind_param("i", $idPregunta);
$query->execute();
$result = $query->get_result();

$respuestas = [];
while ($row = $result->fetch_assoc()) {
    $respuestas[] = $row;
}

echo json_encode($respuestas);