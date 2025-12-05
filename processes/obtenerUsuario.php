<?php
require "conexion.php";

$id = $_GET['id_usuario'];

$sql = $conexion->query("SELECT * FROM usuario WHERE id_usuario = $id");

if ($sql->num_rows > 0) {
    echo json_encode($sql->fetch_assoc());
} else {
    echo json_encode(["error" => "Usuario no encontrado"]);
}
