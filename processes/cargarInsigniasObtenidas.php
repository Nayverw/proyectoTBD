<?php
header('Content-Type: application/json');
require_once '../conexion.php'; // Ajusta la ruta si es necesario

if (!isset($_GET['idRolUsuario'])) {
    echo json_encode([]);
    exit;
}

$idRolUsuario = intval($_GET['idRolUsuario']);

// Consulta para obtener todas las insignias obtenidas por el usuario, ordenadas por rareza
$sql = "
    SELECT 
        i.nombre AS nombre_insignia,
        i.descripcion AS descripcion,
        r.nombre AS rareza
    FROM OBTENER_INSIGNIA oi
    INNER JOIN INSIGNIA i ON oi.id_insignia = i.id_insignia
    INNER JOIN RAREZA r ON i.id_rareza = r.id_rareza
    WHERE oi.id_rol_usuario = ?
    ORDER BY r.valor DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idRolUsuario);
$stmt->execute();
$result = $stmt->get_result();

$insignias = [];
while($row = $result->fetch_assoc()){
    $insignias[] = $row;
}

echo json_encode($insignias);
?>