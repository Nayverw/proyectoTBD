<?php
require "conexion.php";

$id = $_POST['id_usuario'];
$nombres = $_POST['nombres'];
$apellidos = $_POST['apellidos'];
$fecha = $_POST['fecha_nacimiento'];
$ci = $_POST['ci'];
$telefono = $_POST['telefono'];
$estado = $_POST['estado'];

$sql = "UPDATE usuario SET
        nombres='$nombres',
        apellidos='$apellidos',
        fecha_nacimiento='$fecha',
        ci='$ci',
        telefono='$telefono',
        estado='$estado'
        WHERE id_usuario = $id";

if ($conexion->query($sql)) {
    echo json_encode(["mensaje" => "Datos actualizados correctamente"]);
} else {
    echo json_encode(["mensaje" => "Error al actualizar: " . $conexion->error]);
}
