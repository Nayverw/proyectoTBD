<?php
// C:\xampp\htdocs\proyectoTBD\processes\ForosPreguntaCrear.php
header("Content-Type: application/json");

// Validación
if (!isset($_POST['descripcion'], $_POST['id_rol_usuario'], $_POST['id_foro'])) {
    echo json_encode(["error" => "Faltan datos necesarios"]);
    exit;
}

$descripcion = trim($_POST['descripcion']);
$idRolUsuario = intval($_POST['id_rol_usuario']);
$idForo = intval($_POST['id_foro']);
$fecha = date("Y-m-d H:i:s");

require_once "../conexion.php";

$query = $conn->prepare("INSERT INTO PREGUNTA_FORO (descripcion, fecha, id_rol_usuario, id_foro) VALUES (?, ?, ?, ?)");
$query->bind_param("ssii", $descripcion, $fecha, $idRolUsuario, $idForo);

if ($query->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}