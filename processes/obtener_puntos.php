<?php
require_once __DIR__ . '/../conexion.php';
header('Content-Type: application/json; charset=utf-8');

if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'Usuario no identificado']);
    exit;
}

$idRolUsuario = intval($_GET['id']);

$sql = "SELECT total_puntos_actuales
        FROM gestion_puntos
        WHERE id_rol_usuario = ?
        ORDER BY id_gestion_puntos DESC
        LIMIT 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idRolUsuario);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
    echo json_encode(['puntos_actuales' => $row['total_puntos_actuales']]);
} else {
    echo json_encode(['puntos_actuales' => 0]);
}

$stmt->close();
$conn->close();