<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

// Recibir datos desde FormData (POST)
$nombre = trim($_POST['nombre'] ?? '');
$precio = intval($_POST['precio_puntos'] ?? 0);
$descuento = isset($_POST['descuento']) && $_POST['descuento'] !== '' ? intval($_POST['descuento']) : null;
$rol = trim($_POST['rol'] ?? null);
$id_tipo_recompensa = intval($_POST['id_tipo_recompensa'] ?? 0);

if (!$nombre || !$precio || !$id_tipo_recompensa) {
    echo json_encode(['success'=>false,'error'=>'Datos incompletos']);
    exit;
}

$sql = $conn->prepare("INSERT INTO recompensa (nombre, precio_puntos, descuento, rol, id_tipo_recompensa) VALUES (?, ?, ?, ?, ?)");
$sql->bind_param("siisi", $nombre, $precio, $descuento, $rol, $id_tipo_recompensa);

if ($sql->execute()) {
    echo json_encode(['success'=>true, 'mensaje'=>'Recompensa creada', 'id_recompensa'=>$sql->insert_id]);
} else {
    echo json_encode(['success'=>false, 'error'=>$sql->error]);
}

$sql->close();
$conn->close();
?>
