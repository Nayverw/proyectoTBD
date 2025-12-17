<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

$nombre = $_POST['nombre_curso'] ?? '';
$extra  = $_POST['curso_extra'] ?? 0;

if ($nombre === '') {
    echo json_encode(["error" => "Nombre vacío"]);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO tipo_curso (nombre_curso, curso_extra) VALUES (?, ?)"
);
$stmt->bind_param("si", $nombre, $extra);
$ok = $stmt->execute();

echo json_encode(["ok" => $ok]);
