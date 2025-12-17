<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

$id_usuario = $_POST['id_usuario'] ?? 0;
$nombres = $_POST['nombres'] ?? '';
$apellidos = $_POST['apellidos'] ?? '';
$fecha_nacimiento = $_POST['fecha_nacimiento'] ?? '';
$ci = $_POST['ci'] ?? '';
$telefono = $_POST['telefono'] ?? '';
$correo = $_POST['correo'] ?? '';
$estado = $_POST['estado'] ?? 'Activo';
$correo_institucional = $_POST['correo_institucional'] ?? '';
$contrasenia = $_POST['contrasenia'] ?? '';

// Actualizar alumno
$stmt = $conn->prepare("UPDATE usuario SET nombres=?, apellidos=?, fecha_nacimiento=?, ci=?, telefono=?, correo=?, estado=? WHERE id_usuario=?");
$stmt->bind_param("sssssssi", $nombres, $apellidos, $fecha_nacimiento, $ci, $telefono, $correo, $estado, $id_usuario);
$stmt->execute();

// Obtener id_rol_usuario para login
$res = $conn->query("SELECT id_rol_usuario FROM rol_usuario WHERE id_usuario=$id_usuario AND id_rol=1");
$row = $res->fetch_assoc();
$id_rol_usuario = $row['id_rol_usuario'] ?? 0;

// Actualizar login
if ($id_rol_usuario) {
    $resLogin = $conn->query("SELECT id_login FROM login WHERE id_rol_usuario=$id_rol_usuario");
    $rowLogin = $resLogin->fetch_assoc();
    $id_login = $rowLogin['id_login'] ?? 0;

    if ($id_login) {
        $stmt2 = $conn->prepare("UPDATE login SET correo_institucional=?, contrasenia=? WHERE id_login=?");
        $stmt2->bind_param("ssi", $correo_institucional, $contrasenia, $id_login);
        $stmt2->execute();
    } else {
        // Si no existe login, crear
        $stmt3 = $conn->prepare("INSERT INTO login (contrasenia, codigo, correo_institucional, id_rol_usuario) VALUES (?, '', ?, ?)");
        $stmt3->bind_param("ssi", $contrasenia, $correo_institucional, $id_rol_usuario);
        $stmt3->execute();
    }
}

echo json_encode(["ok" => true]);
