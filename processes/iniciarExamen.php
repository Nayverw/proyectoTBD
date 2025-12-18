<?php
ob_clean();
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include("../conexion.php");

if (!isset($conn)) {
    echo json_encode(["success" => false, "error" => "Conexión no disponible"]);
    exit;
}

$id_usuario = intval($_POST['id_usuario'] ?? 0);
$id_examen  = intval($_POST['id_examen'] ?? 0);
$id_modulo  = intval($_POST['id_modulo'] ?? 0);

if (!$id_usuario || !$id_examen || !$id_modulo) {
    echo json_encode([
        "success" => false,
        "error" => "Datos incompletos para iniciar examen"
    ]);
    exit;
}

// Verificar si ya inició este examen
$check = $conn->prepare("
    SELECT id_examen_realizado 
    FROM examen_realizado
    WHERE id_usuario = ? AND id_examen = ?
    LIMIT 1
");
$check->bind_param("ii", $id_usuario, $id_examen);
$check->execute();
$res = $check->get_result();

if ($res->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "error" => "Ya iniciaste este examen"
    ]);
    exit;
}

// Generar token
$token = bin2hex(random_bytes(32));
$fecha = date("Y-m-d H:i:s");

// Insertar registro
$stmt = $conn->prepare("
    INSERT INTO examen_realizado 
    (id_usuario, id_examen, id_modulo, estado, fecha_realizado, token)
    VALUES (?, ?, ?, 'PENDIENTE', ?, ?)
");

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "error" => "Error prepare: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param(
    "iiiss",
    $id_usuario,
    $id_examen,
    $id_modulo,
    $fecha,
    $token
);

if (!$stmt->execute()) {
    echo json_encode([
        "success" => false,
        "error" => "Error execute: " . $stmt->error
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "token" => $token
]);
exit;
