<?php
header('Content-Type: application/json; charset=utf-8');
include("../conexion.php");

// Leer datos del POST
$nombre = $_POST['nombre_modulo'] ?? '';
$puntos = $_POST['valor_puntos'] ?? '';
$id_curso = $_POST['id_curso'] ?? '';

if (!$nombre || !$puntos || !$id_curso) {
    echo json_encode(["success" => false, "error" => "Datos incompletos"]);
    exit;
}

// Verificar que no existan más de 4 módulos en el curso
$stmt = $conn->prepare("SELECT COUNT(*) AS total FROM modulo WHERE id_curso=?");
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error en prepare: ".$conn->error]);
    exit;
}
$stmt->bind_param("i", $id_curso);
$stmt->execute();
$result = $stmt->get_result();
$total = $result->fetch_assoc()['total'] ?? 0;

if ($total >= 4) {
    echo json_encode(["success" => false, "error" => "Límite de 4 módulos alcanzado para este curso"]);
    exit;
}

// Insertar nuevo módulo
$stmt = $conn->prepare("INSERT INTO modulo (nombre, valor_puntos, id_curso) VALUES (?, ?, ?)");
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error en prepare: ".$conn->error]);
    exit;
}
$stmt->bind_param("sii", $nombre, $puntos, $id_curso);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "mensaje" => "Módulo creado correctamente"]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}
exit;
?>
