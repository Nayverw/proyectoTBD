<?php
// webhookExamen.php
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['token'], $data['nota'])) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

$token = $data['token'];
$nota = floatval($data['nota']);

// Conexión a la base de datos
$mysqli = new mysqli("localhost", "usuario", "password", "nombre_bd");
if ($mysqli->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión: ' . $mysqli->connect_error]);
    exit;
}

// Actualizar nota en examen_realizado
$stmt = $mysqli->prepare("
    UPDATE examen_realizado
    SET nota = ?, fecha_realizado = NOW(), estado = 'FINALIZADO'
    WHERE token = ?
");
$stmt->bind_param("ds", $nota, $token);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'mensaje' => 'Nota registrada correctamente']);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$mysqli->close();
