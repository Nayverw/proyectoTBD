<?php
header("Content-Type: application/json");
require_once "../conexion.php"; // Ajusta si tu archivo de conexión tiene otro nombre

$id_rol_usuario = $_GET['id_rol_usuario'] ?? null;
$id_seminario = $_GET['id_seminario'] ?? null;

if (!$id_rol_usuario || !$id_seminario) {
    echo json_encode(["error" => "Parámetros incompletos"]);
    exit;
}

// OBTENER DATOS DEL SEMINARIO
$sql = "SELECT nombre, descripccion, fecha 
        FROM SEMINARIO 
        WHERE id_seminario = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_seminario);
$stmt->execute();
$result = $stmt->get_result();
$seminario = $result->fetch_assoc();

if (!$seminario) {
    echo json_encode(["error" => "Seminario no encontrado"]);
    exit;
}

// OBTENER CÓDIGO DEL CANJE
$sql2 = "SELECT codigo 
         FROM CANJE_SEMINARIO
         WHERE id_rol_usuario = ? AND id_seminario = ?";

$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("ii", $id_rol_usuario, $id_seminario);
$stmt2->execute();
$result2 = $stmt2->get_result();
$canje = $result2->fetch_assoc();

echo json_encode([
    "seminario" => $seminario,
    "codigo" => $canje['codigo'] ?? "No canjeado"
]);
?>
