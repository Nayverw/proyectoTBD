<?php
ob_clean();
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");

// id_modulo y id_usuario (estudiante)
$id_modulo = isset($_GET['id_modulo']) ? intval($_GET['id_modulo']) : 0;
$id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : 0;

if (!$id_modulo) {
    echo json_encode(["success" => false, "error" => "ID de módulo inválido"]);
    exit;
}

// Obtener exámenes del módulo y si el estudiante ya los realizó
$sql = "SELECT 
            e.id_examen,
            e.nombre AS nombre_examen,
            e.valor_puntos,
            e.cantidad_oportunidades,
            IFNULL(er.nota, 0) AS nota_realizada,
            IF(er.id_examen_realizado IS NULL, 0, 1) AS entregado
        FROM examen e
        LEFT JOIN examen_realizado er
            ON e.id_examen = er.id_examen
            AND er.id_modulo = e.id_modulo
            AND er.id_usuario = ?
        WHERE e.id_modulo = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $id_usuario, $id_modulo);
$stmt->execute();
$result = $stmt->get_result();

$examenes = [];
while ($row = $result->fetch_assoc()) {
    $examenes[] = [
        "id_examen" => (int)$row["id_examen"],
        "nombre_examen" => $row["nombre_examen"],
        "valor_puntos" => (float)$row["valor_puntos"],
        "cantidad_oportunidades" => (int)$row["cantidad_oportunidades"],
        "nota_realizada" => (float)$row["nota_realizada"],
        "entregado" => (bool)$row["entregado"]
    ];
}

echo json_encode(["success" => true, "examenes" => $examenes]);
exit;
