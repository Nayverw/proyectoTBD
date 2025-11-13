<?php
header('Content-Type: application/json');
require_once '../conexion.php'; // Igual que en el otro script

if (!isset($_GET['idRolUsuario'])) {
    echo json_encode([]);
    exit;
}

$idRolUsuario = intval($_GET['idRolUsuario']);

// Consulta: insignias que el usuario aún NO ha obtenido
$sql = "
    SELECT 
        i.id_insignia,
        i.nombre AS nombre_insignia,
        i.descripcion,
        r.nombre AS rareza
    FROM INSIGNIA i
    INNER JOIN RAREZA r ON i.id_rareza = r.id_rareza
    WHERE i.id_insignia NOT IN (
        SELECT id_insignia 
        FROM OBTENER_INSIGNIA 
        WHERE id_rol_usuario = ?
    )
    ORDER BY r.valor DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idRolUsuario);
$stmt->execute();
$result = $stmt->get_result();

$insignias = [];
while ($row = $result->fetch_assoc()) {
    $insignias[] = $row;
}

echo json_encode($insignias);
?>
