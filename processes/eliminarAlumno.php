<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

$id_usuario = $_POST['id_usuario'] ?? 0;

// Obtener id_rol_usuario
$res = $conn->query("SELECT id_rol_usuario FROM rol_usuario WHERE id_usuario=$id_usuario AND id_rol=1");
$row = $res->fetch_assoc();
$id_rol_usuario = $row['id_rol_usuario'] ?? 0;

// Eliminar login
if ($id_rol_usuario) {
    $conn->query("DELETE FROM login WHERE id_rol_usuario=$id_rol_usuario");
}

// Eliminar rol
$conn->query("DELETE FROM rol_usuario WHERE id_usuario=$id_usuario AND id_rol=1");

// Eliminar usuario
$conn->query("DELETE FROM usuario WHERE id_usuario=$id_usuario");

echo json_encode(["ok" => true]);
