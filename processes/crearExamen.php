<?php
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");

// Leer datos del POST
$nombre = trim($_POST['nombre_examen'] ?? '');
$valor_puntos = $_POST['valor_puntos'] ?? null;
$cantidad_oportunidades = $_POST['cantidad_oportunidades'] ?? null;
$id_modulo = $_POST['id_modulo'] ?? '';

if (!$nombre || !$valor_puntos || !$cantidad_oportunidades || !$id_modulo) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

// Verificar que no exista ya un examen para este módulo (1 examen por módulo)
$stmt = $conn->prepare("SELECT COUNT(*) AS total FROM examen WHERE id_modulo=?");
$stmt->bind_param("i", $id_modulo);
$stmt->execute();
$result = $stmt->get_result();
$total = $result->fetch_assoc()['total'] ?? 0;

if ($total >= 1) {
    echo json_encode(["success" => false, "error" => "Este módulo ya tiene un examen creado"]);
    exit;
}

// Insertar examen con los datos proporcionados
$stmt = $conn->prepare("INSERT INTO examen (nombre, valor_puntos, cantidad_oportunidades, id_modulo) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error en prepare: ".$conn->error]);
    exit;
}
$stmt->bind_param("siii", $nombre, $valor_puntos, $cantidad_oportunidades, $id_modulo);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "mensaje" => "Examen creado correctamente"]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}
exit;
?>
