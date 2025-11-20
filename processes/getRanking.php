<?php
ob_start(); // Captura cualquier salida extra
header('Content-Type: application/json');

include __DIR__ . '/../conexion.php'; // ruta correcta

$rol = isset($_GET['rol']) ? intval($_GET['rol']) : 1; // 1=estudiante, 2=docente

$sql = "SELECT CONCAT(u.nombres, ' ', u.apellidos) AS nombre_completo, 
               COALESCE(g.total_puntos_acumulados, 0) AS total_puntos_acumulados
        FROM rol_usuario r
        LEFT JOIN usuario u ON r.id_usuario = u.id_usuario
        LEFT JOIN gestion_puntos g ON g.id_rol_usuario = r.id_rol_usuario
        WHERE r.id_rol = ?
        ORDER BY total_puntos_acumulados DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $rol);
$stmt->execute();
$result = $stmt->get_result();

$ranking = [];
while($row = $result->fetch_assoc()) {
    // Asegurar que total_puntos_acumulados siempre tenga un número
    $row['total_puntos_acumulados'] = intval($row['total_puntos_acumulados']);
    $ranking[] = $row;
}

echo json_encode($ranking);
ob_end_flush(); // Envía solo el JSON limpio
?>
