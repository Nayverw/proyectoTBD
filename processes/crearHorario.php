<?php
header('Content-Type: application/json');
require_once("../conexion.php");

$dia = $_POST['dia'] ?? '';
$hora = $_POST['hora'] ?? '';
$valor_puntos = intval($_POST['valor_puntos'] ?? 0);
$id_aula = intval($_POST['id_aula'] ?? 0);

if (empty($dia) || empty($hora) || !$id_aula) {
    echo json_encode([
        "success" => false,
        "error" => "Datos incompletos para crear el horario"
    ]);
    exit;
}

/* Verificar que el aula exista y esté disponible */
$stmtAula = $conn->prepare(
    "SELECT disponible FROM aula WHERE id_aula = ?"
);
$stmtAula->bind_param("i", $id_aula);
$stmtAula->execute();
$resAula = $stmtAula->get_result();

if ($resAula->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "error" => "El aula seleccionada no existe"
    ]);
    exit;
}

$aula = $resAula->fetch_assoc();
if ((int)$aula['disponible'] !== 1) {
    echo json_encode([
        "success" => false,
        "error" => "El aula no está disponible"
    ]);
    exit;
}

$stmtAula->close();

/* Crear horario SIN curso */
$stmt = $conn->prepare(
    "INSERT INTO horario (dia, hora, valor_puntos, id_aula, id_curso)
     VALUES (?, ?, ?, ?, NULL)"
);

$stmt->bind_param("ssii", $dia, $hora, $valor_puntos, $id_aula);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "mensaje" => "Horario creado correctamente"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
