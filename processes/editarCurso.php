<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

$id     = $_POST['id_tipo_curso'] ?? 0;
$nombre = $_POST['nombre_curso'] ?? '';
$extra  = $_POST['curso_extra'] ?? 0;

$stmt = $conn->prepare(
    "UPDATE tipo_curso SET nombre_curso = ?, curso_extra = ? WHERE id_tipo_curso = ?"
);
$stmt->bind_param("sii", $nombre, $extra, $id);
$ok = $stmt->execute();

echo json_encode(["ok" => $ok]);
