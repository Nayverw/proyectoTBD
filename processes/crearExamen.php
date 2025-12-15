<?php 
ob_clean(); // Limpia cualquier salida basura
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 1);
include("../conexion.php");

// Leer datos del POST
$nombre = trim($_POST['nombre_examen'] ?? '');
$valor_puntos = $_POST['valor_puntos'] ?? null;
$cantidad_oportinudades = $_POST['cantidad_oportunidades'] ?? null; // JS envía "cantidad_oportunidades"
$link_form = trim($_POST['link_form'] ?? null);
$id_modulo = $_POST['id_modulo'] ?? '';

if (!$nombre || !$valor_puntos || !$cantidad_oportinudades || !$id_modulo) {
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

// Insertar examen con los datos proporcionados, incluyendo link_form
$stmt = $conn->prepare("
    INSERT INTO examen (nombre, valor_puntos, cantidad_oportinudades, id_modulo, link_form) 
    VALUES (?, ?, ?, ?, ?)
");
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error en prepare: ".$conn->error]);
    exit;
}
$stmt->bind_param("siiis", $nombre, $valor_puntos, $cantidad_oportinudades, $id_modulo, $link_form);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "mensaje" => "Examen creado correctamente"]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}
exit;
?>
