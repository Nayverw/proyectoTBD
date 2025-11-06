<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../scripts/conexion.php';

$id_rol_usuario = isset($_GET['id_rol_usuario']) ? (int)$_GET['id_rol_usuario'] : 0;

if ($id_rol_usuario <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID de rol inválido']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT total_puntos_acumulados, total_puntos_gastados, total_puntos_actuales 
                            FROM gestion_puntos 
                            WHERE id_rol_usuario = ?");
    $stmt->bind_param('i', $id_rol_usuario);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if (!$row) {
        echo json_encode(['success' => false, 'message' => 'Sin registro de puntos']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'puntos' => [
            'acumulados' => (int)$row['total_puntos_acumulados'],
            'gastados'   => (int)$row['total_puntos_gastados'],
            'actuales'   => (int)$row['total_puntos_actuales']
        ]
    ]);
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
