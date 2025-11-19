<?php
header("Content-Type: application/json");
require_once "../conexion.php"; // AJUSTA si tu archivo se llama distinto

if (!isset($_GET['id_rol_usuario'])) {
    echo json_encode([]);
    exit;
}

$id_rol_usuario = intval($_GET['id_rol_usuario']);

$sql = "
    SELECT s.id_seminario, s.nombre
    FROM CANJE_SEMINARIO cs
    INNER JOIN SEMINARIO s ON cs.id_seminario = s.id_seminario
    WHERE cs.id_rol_usuario = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_rol_usuario);
$stmt->execute();
$result = $stmt->get_result();

$seminarios = [];

while ($row = $result->fetch_assoc()) {
    $seminarios[] = $row;
}

echo json_encode($seminarios);
$stmt->close();
$conn->close();