<?php
header("Content-Type: application/json");

if (!isset($_POST['id_foro'])) {
    echo json_encode(["error" => "No se recibió id_foro"]);
    exit;
}

$idForo = intval($_POST['id_foro']);

require_once "../conexion.php";

$query = $conn->prepare("
    SELECT 
        pf.id_pregunta_foro,
        pf.descripcion,
        pf.fecha,
        r.nombre AS rol,
        CONCAT(u.nombres, ' ', u.apellidos) AS usuario
    FROM PREGUNTA_FORO pf
    INNER JOIN ROL_USUARIO ru ON pf.id_rol_usuario = ru.id_rol_usuario
    INNER JOIN USUARIO u ON ru.id_usuario = u.id_usuario
    INNER JOIN ROL r ON ru.id_rol = r.id_rol
    WHERE pf.id_foro = ?
    ORDER BY pf.fecha DESC
");
$query->bind_param("i", $idForo);
$query->execute();
$result = $query->get_result();

$preguntas = [];
while ($row = $result->fetch_assoc()) {
    $preguntas[] = $row;
}

echo json_encode($preguntas);