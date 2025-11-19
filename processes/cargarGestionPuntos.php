<?php
// processes/cargarGestionPuntos.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

$idRolUsuario = intval($_GET['idRolUsuario'] ?? 0);

if (!$idRolUsuario) {
    echo json_encode(['success' => false, 'error' => 'Falta idRolUsuario']);
    exit;
}

$sql = "SELECT total_puntos_acumulados, total_puntos_gastados, total_puntos_actuales
        FROM gestion_puntos
        WHERE id_rol_usuario = ? LIMIT 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idRolUsuario);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'No se encontró registro de puntos']);
    exit;
}

$row = $res->fetch_assoc();

echo json_encode([
    'success' => true,
    'total_puntos_acumulados' => $row['total_puntos_acumulados'],
    'total_puntos_gastados' => $row['total_puntos_gastados'],
    'total_puntos_actuales' => $row['total_puntos_actuales']
]);

$stmt->close();
$conn->close();
