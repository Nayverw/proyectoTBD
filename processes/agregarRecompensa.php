<?php
// processes/agregarRecompensa.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$nombre = $_POST['nombre'] ?? '';
$precio = intval($_POST['precio_puntos'] ?? 0);
$descuento = $_POST['descuento'] ?? null;
$rol = $_POST['rol'] ?? 'TODOS';
$id_tipo = intval($_POST['id_tipo_recompensa'] ?? 1);

if ($nombre === '' || $precio <= 0) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

$sql = "INSERT INTO recompensa (nombre, precio_puntos, descuento, rol, id_tipo_recompensa)
        VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sissi", $nombre, $precio, $descuento, $rol, $id_tipo);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Recompensa agregada']);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
