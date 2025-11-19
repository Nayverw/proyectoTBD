<?php
header('Content-Type: application/json');
require_once "../conexion.php";

if (!isset($_GET['id_rol_usuario'])) {
    echo json_encode(["success" => false, "error" => "Falta id_rol_usuario"]);
    exit;
}

$id = intval($_GET['id_rol_usuario']);

$sql = "SELECT id_rol FROM rol_usuario WHERE id_rol_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res && $res->num_rows === 1) {
    $fila = $res->fetch_assoc();
    echo json_encode(["success" => true, "id_rol" => $fila["id_rol"]]);
} else {
    echo json_encode(["success" => false, "error" => "No encontrado"]);
}
