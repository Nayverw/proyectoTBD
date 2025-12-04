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

/* -----------------------------------------------------
   NUEVO: traer módulos + contar exámenes por módulo
------------------------------------------------------ */

$sql = "
SELECT 
    m.id_modulo,
    m.nombre,
    m.valor_puntos,
    (
        SELECT COUNT(*)
        FROM examen e
        WHERE e.id_modulo = m.id_modulo
    ) AS total_examenes
FROM modulo m
WHERE m.id_curso = ?
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false, 
        "error" => "Error en prepare: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("i", $id_curso);
$stmt->execute();
$result = $stmt->get_result();

$modulos = [];

while ($row = $result->fetch_assoc()) {
    $modulos[] = [
        "id_modulo"     => $row["id_modulo"],
        "nombre"        => $row["nombre"],
        "valor_puntos"  => $row["valor_puntos"] ?? 0,

        // NUEVO: flag booleano para el JS
        "tiene_examen"  => intval($row["total_examenes"]) > 0,

        // Opcional: devolver el conteo real
        "total_examenes" => intval($row["total_examenes"])
    ];
}

echo json_encode([
    "success" => true,
    "modulos" => $modulos
]);
exit;
