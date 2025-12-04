<?php
// Limpiar cualquier salida previa
ob_clean();
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(E_ALL);

include("../conexion.php");
if (!isset($conn) && isset($conexion)) $conn = $conexion;

// Obtener id_modulo
$id_modulo = isset($_GET['id_modulo']) ? intval($_GET['id_modulo']) : 0;

if (!$id_modulo) {
    echo json_encode(["success" => false, "error" => "ID de módulo inválido"]);
    exit;
}

// Consulta segura
$sql = "SELECT id_examen, nombre AS nombre_examen, valor_puntos, cantidad_oportunidades
        FROM examen
        WHERE id_modulo = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "error" => "Error en prepare: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $id_modulo);

if (!$stmt->execute()) {
    echo json_encode([
        "success" => false,
        "error" => "Error en execute: " . $stmt->error
    ]);
    exit;
}

$result = $stmt->get_result();
$examenes = [];

while ($row = $result->fetch_assoc()) {
    $examenes[] = [
        "id_examen" => (int)$row["id_examen"],
        "nombre_examen" => $row["nombre_examen"],
        "valor_puntos" => isset($row["valor_puntos"]) ? (float)$row["valor_puntos"] : 0,
        "cantidad_oportunidades" => isset($row["cantidad_oportunidades"]) ? (int)$row["cantidad_oportunidades"] : 1
    ];
}

// Devolver JSON
echo json_encode([
    "success" => true,
    "examenes" => $examenes
]);
exit;
