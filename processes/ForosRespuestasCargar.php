<?php
header("Content-Type: application/json");

if (!isset($_POST['id_pregunta_foro'])) {
    echo json_encode(["error" => "No se recibió id_pregunta_foro"]);
    exit;
}

$idPregunta = intval($_POST['id_pregunta_foro']);

require_once "../conexion.php";

$query = $conn->prepare("
    SELECT 
        rp.descripcion,
        rp.fecha,
        r.nombre AS rol,
        CONCAT(u.nombres, ' ', u.apellidos) AS usuario
    FROM RESPUESTA_PREGUNTA rp
    INNER JOIN ROL_USUARIO ru ON rp.id_rol_usuario = ru.id_rol_usuario
    INNER JOIN USUARIO u ON ru.id_usuario = u.id_usuario
    INNER JOIN ROL r ON ru.id_rol = r.id_rol
    WHERE rp.id_pregunta_foro = ?
    ORDER BY rp.fecha ASC
");
$query->bind_param("i", $idPregunta);
$query->execute();
$result = $query->get_result();

$respuestas = [];
while ($row = $result->fetch_assoc()) {
    $respuestas[] = $row;
}

echo json_encode($respuestas);