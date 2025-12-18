<?php
header('Content-Type: application/json');
include 'conexion.php';

$id_curso = $_POST['id_curso'] ?? null;
$id_horario = $_POST['id_horario'] ?? null;

if(!$id_curso || !$id_horario){
    echo json_encode(['success' => false, 'error' => 'Faltan datos']);
    exit;
}

$stmt = $conn->prepare("UPDATE horario SET id_curso=? WHERE id_horario=?");
$stmt->bind_param("ii", $id_curso, $id_horario);

if($stmt->execute()){
    echo json_encode(['success' => true, 'mensaje' => 'Horario asignado al curso correctamente']);
}else{
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
$stmt->close();
$conn->close();
?>
