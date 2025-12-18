<?php
include("../conexion.php");

$token = $_POST['token'] ?? null;
$nota  = $_POST['nota'] ?? null;

if (!$token || $nota === null) {
    echo json_encode(["success"=>false, "error"=>"Datos incompletos"]);
    exit;
}

$sql = "UPDATE examen_realizado
        SET nota = ?, estado = 'FINALIZADO', fecha_realizado = NOW()
        WHERE token = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $nota, $token);
$stmt->execute();

echo json_encode(["success"=>true]);
