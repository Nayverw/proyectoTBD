<?php
header('Content-Type: application/json');
require_once '../conexion.php';

// Validar parámetro
if (!isset($_GET['idRolUsuario'])) {
    echo json_encode([]);
    exit;
}

$idRolUsuario = intval($_GET['idRolUsuario']);

// 🔹 Primero obtenemos el rol (nombre del rol) del usuario
$sqlRol = "SELECT r.nombre AS nombre_rol 
           FROM ROL_USUARIO ru 
           INNER JOIN ROL r ON ru.id_rol = r.id_rol 
           WHERE ru.id_rol_usuario = ?";

$stmtRol = $conn->prepare($sqlRol);
$stmtRol->bind_param("i", $idRolUsuario);
$stmtRol->execute();
$resultRol = $stmtRol->get_result();
$nombreRol = null;

if ($rowRol = $resultRol->fetch_assoc()) {
    $nombreRol = $rowRol['nombre_rol'];
}

$stmtRol->close();

// Si no se encuentra el rol del usuario, devolvemos vacío
if (!$nombreRol) {
    echo json_encode([]);
    exit;
}

// 🔹 Consultar insignias NO obtenidas del mismo rol
$sql = "
    SELECT 
        i.id_insignia,
        i.nombre AS nombre_insignia,
        i.descripcion,
        r.nombre AS rareza
    FROM INSIGNIA i
    INNER JOIN RAREZA r ON i.id_rareza = r.id_rareza
    WHERE i.rol = ? 
      AND i.id_insignia NOT IN (
          SELECT id_insignia 
          FROM OBTENER_INSIGNIA 
          WHERE id_rol_usuario = ?
      )
    ORDER BY r.valor DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $nombreRol, $idRolUsuario);
$stmt->execute();
$result = $stmt->get_result();

$insignias = [];
while ($row = $result->fetch_assoc()) {
    $insignias[] = $row;
}

// Enviar respuesta JSON
echo json_encode($insignias);
?>
