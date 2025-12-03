<?php
header("Content-Type: application/json");
include("../conexion.php");

// Recibir datos
$nombre = trim($_POST["nombre"] ?? "");
$ubicacion = trim($_POST["ubicacion"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");
$disponible = isset($_POST["disponible"]) ? intval($_POST["disponible"]) : 1;

if (!$nombre || !$ubicacion || !$descripcion) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit();
}

$sql = "INSERT INTO aula (nombre, ubicacion, descripcion, disponible) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssi", $nombre, $ubicacion, $descripcion, $disponible);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "mensaje" => "Aula creada correctamente"]);
} else {
    echo json_encode(["success" => false, "error" => "Error al crear el aula"]);
}
$stmt->close();
$conn->close();
?>
