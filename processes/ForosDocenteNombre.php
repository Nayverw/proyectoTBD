<?php
header("Content-Type: application/json");
require_once("../conexion.php");

$idRol = $_GET["idRol"];

// Obtener datos del docente
$sql = "SELECT U.nombres, U.apellidos
        FROM ROL_USUARIO RU
        INNER JOIN USUARIO U ON U.id_usuario = RU.id_usuario
        WHERE RU.id_rol_usuario = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idRol);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        "nombre" => $row["nombres"] . " " . $row["apellidos"]
    ]);
} else {
    echo json_encode(["nombre" => "DOCENTE NO ENCONTRADO"]);
}