<?php
header('Content-Type: application/json');
require_once("../conexion.php");

$nombre = $_POST['nombre'] ?? '';
$ubicacion = $_POST['ubicacion'] ?? '';
$descripcion = $_POST['descripcion'] ?? '';
$disponible = isset($_POST['disponible']) ? intval($_POST['disponible']) : 1;

if (empty($nombre) || empty($ubicacion)) {
    echo json_encode([
        "success" => false,
        "error" => "Nombre y ubicación son obligatorios"
    ]);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO aula (nombre, ubicacion, descripcion, disponible)
     VALUES (?, ?, ?, ?)"
);

$stmt->bind_param("sssi", $nombre, $ubicacion, $descripcion, $disponible);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "mensaje" => "Aula creada correctamente"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
