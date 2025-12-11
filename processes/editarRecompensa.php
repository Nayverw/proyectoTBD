<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

// Cambiado para recibir $_POST directamente
$id = intval($_POST['id_recompensa'] ?? 0);
$nombre = trim($_POST['nombre'] ?? '');
$precio = intval($_POST['precio_puntos'] ?? 0);
$descuento = isset($_POST['descuento']) ? intval($_POST['descuento']) : null;
$rol = trim($_POST['rol'] ?? null);
$id_tipo_recompensa = intval($_POST['id_tipo_recompensa'] ?? 0);

if (!$id || !$nombre || !$precio || !$id_tipo_recompensa) {
    echo json_encode(['success'=>false,'error'=>'Datos incompletos']);
    exit;
}

$sql = $conn->prepare("UPDATE recompensa SET nombre=?, precio_puntos=?, descuento=?, rol=?, id_tipo_recompensa=? WHERE id_recompensa=?");
$sql->bind_param("siisii", $nombre, $precio, $descuento, $rol, $id_tipo_recompensa, $id);

if ($sql->execute()) {
    echo json_encode(['success'=>true,'mensaje'=>'Recompensa editada correctamente']);
} else {
    echo json_encode(['success'=>false,'error'=>$sql->error]);
}

$sql->close();
$conn->close();
?>
