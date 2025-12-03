<?php
header("Content-Type: application/json; charset=utf-8");
ini_set('display_errors', 0);
error_reporting(E_ALL);

include_once("../conexion.php");

// -------------------------------------
// VALIDAR PARAMETRO
// -------------------------------------
if (!isset($_GET['id_curso']) || empty($_GET['id_curso'])) {
    echo json_encode([
        "success" => false,
        "error" => "ID de curso no recibido"
    ]);
    exit;
}

$idCurso = intval($_GET['id_curso']);

// -------------------------------------
// CONSULTA SEGÚN TU TABLA REAL
// -------------------------------------
$sql = "SELECT 
            c.id_curso,
            c.preciopuntos,
            c.estado,
            c.duracion,
            c.cupo,
            c.id_tipo_curso,
            tc.nombre AS tipo_curso,
            d.nombre AS docente
        FROM curso c
        LEFT JOIN tipo_curso tc ON tc.id_tipo_curso = c.id_tipo_curso
        LEFT JOIN usuario d ON d.id_usuario = c.id_docente
        WHERE c.id_curso = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false,
        "error" => "Error en prepare(): " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $idCurso);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "error" => "Curso no encontrado"
    ]);
    exit;
}

$curso = $result->fetch_assoc();

// -------------------------------------
// RESPUESTA JSON CORRECTA
// -------------------------------------
echo json_encode([
    "success" => true,
    "curso" => $curso
]);
exit;
?>
