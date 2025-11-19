<?php
// processes/cargarRecompensas.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

if (!isset($_GET['idRolUsuario'])) {
    echo json_encode(['success' => false, 'error' => 'Falta idRolUsuario']);
    exit;
}
$idRolUsuario = intval($_GET['idRolUsuario']);

// 1) obtener nombre del rol del usuario
$sqlRol = "SELECT r.nombre AS nombre_rol
           FROM ROL_USUARIO ru
           INNER JOIN ROL r ON ru.id_rol = r.id_rol
           WHERE ru.id_rol_usuario = ?";
if (!$stmt = $conn->prepare($sqlRol)) {
    echo json_encode(['success' => false, 'error' => 'Error prepare rol: '.$conn->error]);
    exit;
}
$stmt->bind_param("i", $idRolUsuario);
$stmt->execute();
$res = $stmt->get_result();
$row = $res->fetch_assoc();
$stmt->close();
$nombreRol = $row['nombre_rol'] ?? null;

if (!$nombreRol) {
    echo json_encode(['success' => false, 'error' => 'No se encontró rol del usuario.']);
    exit;
}

// 2) obtener puntos actuales del usuario
$sqlPuntos = "SELECT total_puntos_actuales FROM GESTION_PUNTOS WHERE id_rol_usuario = ?";
if (!$stmt = $conn->prepare($sqlPuntos)) {
    echo json_encode(['success' => false, 'error' => 'Error prepare puntos: '.$conn->error]);
    exit;
}
$stmt->bind_param("i", $idRolUsuario);
$stmt->execute();
$res = $stmt->get_result();
$row = $res->fetch_assoc();
$stmt->close();
$puntosActuales = intval($row['total_puntos_actuales'] ?? 0);

// 3) obtener recompensas que correspondan al rol del usuario o globales ('TODOS' o NULL)
$sqlRew = "SELECT id_recompensa, nombre, precio_puntos, descuento, rol, id_tipo_recompensa
           FROM recompensa
           WHERE (rol = ? OR rol = 'TODOS' OR rol IS NULL)
           ORDER BY precio_puntos ASC";
if (!$stmt = $conn->prepare($sqlRew)) {
    echo json_encode(['success' => false, 'error' => 'Error prepare recompensas: '.$conn->error]);
    exit;
}
$stmt->bind_param("s", $nombreRol);
$stmt->execute();
$res = $stmt->get_result();
$recompensas = [];
while ($r = $res->fetch_assoc()) {
    // normalizar descuento (puede ser NULL)
    $r['descuento'] = $r['descuento'] !== null ? $r['descuento'] : null;
    $recompensas[] = $r;
}
$stmt->close();

echo json_encode([
    'success' => true,
    'puntos_actuales' => $puntosActuales,
    'recompensas' => $recompensas
]);
$conn->close();
