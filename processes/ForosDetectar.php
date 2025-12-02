<?php
// C:\xampp\htdocs\proyectoTBD\processes\ForosDetectar.php
header("Content-Type: application/json");

// Validación
if (!isset($_POST['id_rol_usuario'])) {
    echo json_encode(["error" => "No se recibió id_rol_usuario"]);
    exit;
}

$idRolUsuario = intval($_POST['id_rol_usuario']);

require_once "../conexion.php";

// 1. Obtener id_rol desde ROL_USUARIO
$query1 = $conn->prepare("SELECT id_rol FROM ROL_USUARIO WHERE id_rol_usuario = ?");
$query1->bind_param("i", $idRolUsuario);
$query1->execute();
$result1 = $query1->get_result();

if ($result1->num_rows === 0) {
    echo json_encode(["error" => "ID rol_usuario no encontrado"]);
    exit;
}

$row1 = $result1->fetch_assoc();
$idRol = $row1["id_rol"];

// 2. Obtener nombre del rol desde ROL
$query2 = $conn->prepare("SELECT nombre FROM ROL WHERE id_rol = ?");
$query2->bind_param("i", $idRol);
$query2->execute();
$result2 = $query2->get_result();

if ($result2->num_rows === 0) {
    echo json_encode(["error" => "Rol no encontrado"]);
    exit;
}

$row2 = $result2->fetch_assoc();
$nombreRol = $row2["nombre"];

// Respuesta final SOLO LO NECESARIO
echo json_encode([
    "idRolUsuario" => $idRolUsuario,
    "rol" => $nombreRol
]);