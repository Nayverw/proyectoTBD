<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

$nombres = $_POST['nombres'] ?? '';
$apellidos = $_POST['apellidos'] ?? '';
$fecha_nacimiento = $_POST['fecha_nacimiento'] ?? '';
$ci = $_POST['ci'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$correo = $_POST['correo'] ?? '';
$estado = $_POST['estado'] ?? 'Activo';
$correo_institucional = $_POST['correo_institucional'] ?? '';
$contrasenia = $_POST['contrasenia'] ?? '';

if ($nombres === '' || $apellidos === '') {
    echo json_encode(["error" => "Faltan datos obligatorios"]);
    exit;
}

// Insertar alumno
$stmt = $conn->prepare("INSERT INTO usuario (nombres, apellidos, fecha_nacimiento, ci, telefono, correo, estado) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $nombres, $apellidos, $fecha_nacimiento, $ci, $telefono, $correo, $estado);
$stmt->execute();
$id_usuario = $conn->insert_id;

// Insertar rol de estudiante
$stmt2 = $conn->prepare("INSERT INTO rol_usuario (id_usuario, id_rol) VALUES (?, 1)");
$stmt2->bind_param("i", $id_usuario);
$stmt2->execute();
$id_rol_usuario = $conn->insert_id;

// Insertar login
$stmt3 = $conn->prepare("INSERT INTO login (contrasenia, codigo, correo_institucional, id_rol_usuario) VALUES (?, '', ?, ?)");
$stmt3->bind_param("ssi", $contrasenia, $correo_institucional, $id_rol_usuario);
$stmt3->execute();

echo json_encode(["ok" => true]);
