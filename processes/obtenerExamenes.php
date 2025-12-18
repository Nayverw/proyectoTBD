<?php
// Forzar salida limpia JSON
ob_clean();
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once("../conexion.php");
if (!isset($conn) && isset($conexion)) $conn = $conexion;

// -----------------------------
// Validaciones
// -----------------------------
$id_modulo  = isset($_GET['id_modulo']) ? intval($_GET['id_modulo']) : 0;
$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : 0;

if ($id_modulo <= 0) {
    echo json_encode([
        "success" => false,
        "error" => "ID de módulo inválido"
    ]);
    exit;
}

// -----------------------------
// Consulta
// -----------------------------
$sql = "
    SELECT 
        e.id_examen,
        e.nombre AS nombre_examen,
        e.valor_puntos,
        e.cantidad_oportinudades,
        e.link_form,

        er.id_examen AS realizado,
        er.nota, er.estado

    FROM examen e
    LEFT JOIN examen_realizado er 
        ON er.id_examen = e.id_examen
        AND er.id_usuario = ?

    WHERE e.id_modulo = ?
    ORDER BY e.id_examen ASC
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "error" => "Error en prepare",
        "debug" => $conn->error
    ]);
    exit;
}

// bind_param → id_usuario puede ser 0 (docente)
$stmt->bind_param("ii", $id_usuario, $id_modulo);

if (!$stmt->execute()) {
    echo json_encode([
        "success" => false,
        "error" => "Error en execute",
        "debug" => $stmt->error
    ]);
    exit;
}

$result = $stmt->get_result();
$examenes = [];

// -----------------------------
// Construcción del resultado
// -----------------------------
while ($row = $result->fetch_assoc()) {

    $examenes[] = [
        "id_examen" => (int)$row["id_examen"],
        "nombre_examen" => $row["nombre_examen"],
        "valor_puntos" => (float)$row["valor_puntos"],
        "cantidad_oportinudades" => (int)$row["cantidad_oportinudades"],
        "link_form" => $row["link_form"] ?: null,

        // 🔥 Estado del estudiante
        "realizado" => $row["realizado"] !== null,
        "nota" => $row["nota"] !== null ? (float)$row["nota"] : null
    ];
}

// -----------------------------
// Respuesta final
// -----------------------------
echo json_encode([
    "success" => true,
    "examenes" => $examenes
]);
exit;
