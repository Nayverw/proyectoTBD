<?php
ob_clean();
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(E_ALL);

include("../conexion.php");

$id_curso = $_GET['id_curso'] ?? 0;

if (!$id_curso) {
    echo json_encode(["success" => false, "error" => "ID de curso inválido"]);
    exit;
}

$stmt = $conn->prepare("SELECT id_modulo, nombre, valor_puntos FROM modulo WHERE id_curso=?");
$stmt->bind_param("i", $id_curso);
$stmt->execute();
$result = $stmt->get_result();

$modulos = [];
while ($row = $result->fetch_assoc()) {
    $modulos[] = $row;
}

echo json_encode([
    "success" => true,
    "modulos" => $modulos
]);
exit;
