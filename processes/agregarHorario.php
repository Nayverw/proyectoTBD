<?php
header('Content-Type: application/json');
include 'conexion.php';

$dia = $_POST['dia'] ?? '';
$hora = $_POST['hora'] ?? '';
$valor_puntos = $_POST['valor_puntos'] ?? 0;
$id_aula = $_POST['id_aula'] ?? null;

if(!$dia || !$hora || !$id_aula){
    echo json_encode(['success' => false, 'error' => 'Faltan campos obligatorios']);
    exit;
}

// Verificar que el aula esté disponible en ese horario
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM horario WHERE dia=? AND hora=? AND id_aula=?");
$stmt->bind_param("ssi", $dia, $hora, $id_aula);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
if($res['total'] > 0){
    echo json_encode(['success' => false, 'error' => 'Ya existe un horario para esta aula']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO horario (dia, hora, valor_puntos, id_aula) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssii", $dia, $hora, $valor_puntos, $id_aula);

if($stmt->execute()){
    echo json_encode(['success' => true, 'mensaje' => 'Horario creado correctamente']);
}else{
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
$stmt->close();
$conn->close();
?>
