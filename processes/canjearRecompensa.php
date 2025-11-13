<?php

session_start();
header('Content-Type: application/json');
include("../conexion.php");


// Verificar que el usuario esté logueado
if (!isset($_SESSION["correo"])|| !isset($_SESSION['id_rol_usuario'])) {
    echo json_encode(["success" => false, "mensaje" => "Usuario no autenticado"]);
    exit;
}

$id_usuario =$_SESSION["id_usuario"];
$correo = $_SESSION["correo"];
$id_recompensa = $_POST["id_recompensa"];
$id_rol_usuario = $_SESSION["id_rol_usuario"];

// Obtener los puntos del usuario y el precio de la recompensa
$sql = "SELECT puntos FROM USUARIO WHERE correo = $id_usuario";
$result = $conn->query($sql);
if ($result->num_rows == 0) {
    echo json_encode(["success" => false, "mensaje" => "Usuario no encontrado"]);
    exit;
}
$user = $result->fetch_assoc();
$puntos_usuario = $user["puntos"];

$sql = "SELECT precio_puntos FROM RECOMPENSA WHERE id_recompensa = $id_recompensa";
$result = $conn->query($sql);
if ($result->num_rows == 0) {
    echo json_encode(["success" => false, "mensaje" => "Recompensa no encontrada"]);
    exit;
}
$recompensa = $result->fetch_assoc();
$precio = $recompensa["precio_puntos"];

// Verificar si tiene puntos suficientes
if ($puntos_usuario < $precio) {
    echo json_encode(["success" => false, "mensaje" => "No tienes puntos suficientes"]);
    exit;
}

// Restar puntos al usuario
$nuevos_puntos = $puntos_usuario - $precio;
$conn->query("UPDATE USUARIO SET puntos = $nuevos_puntos WHERE correo = $id_usuario");

// Registrar el canje
$conn->query("INSERT INTO CANJE_RECOMPENSA (correo, id_recompensa, fecha) VALUES ($correo, $id_recompensa, NOW())");

echo json_encode([
    "success" => true,
    "mensaje" => "Recompensa canjeada correctamente",
    "puntos_restantes" => $nuevos_puntos
]);

$conn->close();
?>
