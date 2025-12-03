<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(E_ALL);

include("../conexion.php");

$id_modulo = $_GET['id_modulo'] ?? 0;
$id_usuario = $_GET['id_usuario'] ?? 0;

if (!$id_modulo || !$id_usuario) {
    echo json_encode([
        "success" => false,
        "progreso" => 0,
        "error" => "Datos inválidos"
    ]);
    exit;
}

/*
    La tabla progreso_modulo debe tener:
    id_progreso_modulo
    progreso (0–100)
    fecha_actualizacion
    id_modulo
    id_usuario
*/

$stmt = $conn->prepare("
    SELECT progreso 
    FROM progreso_modulo 
    WHERE id_modulo = ? AND id_usuario = ?
    LIMIT 1
");

$stmt->bind_param("ii", $id_modulo, $id_usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {

    echo json_encode([
        "success" => true,
        "progreso" => intval($row['progreso'])
    ]);
    exit;

} else {

    // Si no existe registro, progreso es 0
    echo json_encode([
        "success" => true,
        "progreso" => 0
    ]);
    exit;
}
