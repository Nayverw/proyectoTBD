<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

$id = $_POST['id_tipo_curso'] ?? 0;

$stmt = $conn->prepare(
    "DELETE FROM tipo_curso WHERE id_tipo_curso = ?"
);
$stmt->bind_param("i", $id);
$ok = $stmt->execute();

echo json_encode(["ok" => $ok]);
