<?php
ob_clean();
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");

$id_examen = intval($_GET['id_examen'] ?? 0);

if (!$id_examen) {
    echo json_encode(["success" => false, "error" => "ID de examen inválido"]);
    exit;
}

$sql = "
SELECT 
    u.nombres,
    u.apellidos,
    er.nota,
    er.estado,
    er.fecha_realizado
FROM examen_realizado er
JOIN usuario u ON u.id_usuario = er.id_usuario
WHERE er.id_examen = ?
ORDER BY u.apellidos, u.nombres
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_examen);
$stmt->execute();
$res = $stmt->get_result();

$resultados = [];
while ($row = $res->fetch_assoc()) {
    $resultados[] = $row;
}

echo json_encode([
    "success" => true,
    "resultados" => $resultados
]);
