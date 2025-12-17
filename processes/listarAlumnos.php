<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

// Solo estudiantes (id_rol = 1) y traer info de login
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
            l.contrasenia
        FROM usuario u
        JOIN rol_usuario r ON u.id_usuario = r.id_usuario
        LEFT JOIN login l ON r.id_rol_usuario = l.id_rol_usuario
        WHERE r.id_rol = 1";

$result = $conn->query($sql);

$alumnos = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $alumnos[] = $row;
    }
}

echo json_encode($alumnos);
