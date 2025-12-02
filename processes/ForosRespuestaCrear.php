<?php
// C:\xampp\htdocs\proyectoTBD\processes\ForosRespuestaCrear.php
header("Content-Type: application/json");

// Validación
if (!isset($_POST['descripcion'], $_POST['id_rol_usuario'], $_POST['id_pregunta_foro'])) {
    echo json_encode(["error" => "Faltan datos necesarios"]);
    exit;
}

$descripcion = trim($_POST['descripcion']);
$idRolUsuario = intval($_POST['id_rol_usuario']);
$idPregunta = intval($_POST['id_pregunta_foro']);

require_once "../conexion.php";

$query = $conn->prepare("INSERT INTO RESPUESTA_PREGUNTA (descripcion, fecha, id_pregunta_foro, id_rol_usuario) VALUES (?, NOW(), ?, ?)");
$query->bind_param("sii", $descripcion, $idPregunta, $idRolUsuario);

if ($query->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}
?>