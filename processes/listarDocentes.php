<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

// Solo docentes (id_rol = 2) y traer info de login
$sql = "SELECT 
            u.id_usuario,
            u.nombres,
            u.apellidos,
            u.fecha_nacimiento,
            u.ci,
            u.telefono,
            u.correo,
            u.estado,
            l.correo_institucional,
            l.contrasenia,
            r.id_rol_usuario
        FROM usuario u
        JOIN rol_usuario r ON u.id_usuario = r.id_usuario
        LEFT JOIN login l ON r.id_rol_usuario = l.id_rol_usuario
        WHERE r.id_rol = 2";

$result = $conn->query($sql);

$docentes = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $docentes[] = $row;
    }
}

echo json_encode($docentes);
