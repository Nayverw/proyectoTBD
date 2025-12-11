<?php
// processes/cargarRecompensasAdmin.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

// Este PHP es exclusivo para administradores
// Trae todas las recompensas sin filtrar por rol

$sqlRew = "SELECT id_recompensa, nombre, precio_puntos, descuento, rol, id_tipo_recompensa
           FROM recompensa
           ORDER BY precio_puntos ASC";

$stmt = $conn->prepare($sqlRew);
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Error preparando consulta: '.$conn->error]);
    exit;
}

$stmt->execute();
$res = $stmt->get_result();

$recompensas = [];
while ($r = $res->fetch_assoc()) {
    // Normalizar descuento
    $r['descuento'] = $r['descuento'] !== null ? $r['descuento'] : null;
    $recompensas[] = $r;
}

$stmt->close();

echo json_encode([
    'success' => true,
    'puntos_actuales' => null, // No relevante para admin
    'recompensas' => $recompensas
]);

$conn->close();
