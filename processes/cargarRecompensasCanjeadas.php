<?php
// processes/cargarRecompensasCanjeadas.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

$idRolUsuario = intval($_GET['idRolUsuario'] ?? 0);
if (!$idRolUsuario) {
    echo json_encode(['success' => false, 'error' => 'Falta idRolUsuario']);
    exit;
}

// Recuperar recompensas canjeadas por el usuario
$sql = "SELECT r.id_recompensa, r.nombre, r.precio_puntos, r.descuento, cr.fecha_usado
        FROM canje_recompensa cr
        INNER JOIN recompensa r ON cr.id_recompensa = r.id_recompensa
        WHERE cr.id_rol_usuario = ?
        ORDER BY cr.fecha_usado DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idRolUsuario);
$stmt->execute();
$res = $stmt->get_result();
$recompensas = [];
while ($row = $res->fetch_assoc()) {
    $recompensas[] = $row;
}
$stmt->close();

echo json_encode(['success' => true, 'recompensas' => $recompensas]);
$conn->close();
