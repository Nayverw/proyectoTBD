<?php
header('Content-Type: application/json; charset=utf-8');
include_once('../conexion.php');

if (!isset($_GET['id_curso'])) {
    echo json_encode(["success" => false, "error" => "Falta id_curso"]);
    exit();
}

$id_curso = intval($_GET['id_curso']);

$sql = "
    SELECT 
        ru.id_rol_usuario,
        CONCAT(u.nombres, ' ', u.apellidos) AS nombre,
        u.correo
    FROM inscripcion i
    INNER JOIN rol_usuario ru ON ru.id_rol_usuario = i.id_rol_usuario
    INNER JOIN usuario u ON u.id_usuario = ru.id_usuario
    WHERE i.id_curso = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_curso);
$stmt->execute();
$res = $stmt->get_result();

$alumnos = [];
while ($row = $res->fetch_assoc()) {
    $alumnos[] = $row; // Manteniendo la misma estructura: id_rol_usuario, nombre, correo
}

echo json_encode(["success" => true, "alumnos" => $alumnos]);
?>
