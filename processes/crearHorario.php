<?php
header("Content-Type: application/json");
include("../conexion.php");

// Recibir datos del formulario
$dia = trim($_POST['dia'] ?? '');
$hora = trim($_POST['hora'] ?? '');
$valor_puntos = floatval($_POST['valor_puntos'] ?? 0);
$id_aula = intval($_POST['id_aula'] ?? 0);

// Validar campos obligatorios
if (!$dia || !$hora || !$valor_puntos || !$id_aula) {
    echo json_encode(["success" => false, "error" => "Faltan datos obligatorios"]);
    exit;
}

try {
    // Insertar horario sin curso asignado (id_curso = NULL)
    $sql = "INSERT INTO horario (dia, hora, valor_puntos, id_curso, id_aula) VALUES (?, ?, ?, NULL, ?)";
    $stmt = $conn->prepare($sql);
    if (!$stmt) throw new Exception("Error preparando consulta: " . $conn->error);

    $stmt->bind_param("ssii", $dia, $hora, $valor_puntos, $id_aula);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "mensaje" => "Horario creado", "id_horario" => $stmt->insert_id]);
    } else {
        throw new Exception("Error ejecutando consulta: " . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

$conn->close();
?>
