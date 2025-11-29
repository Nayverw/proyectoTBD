<?php
// C:\xampp\htdocs\proyectoTBD\processes\ForosCrear.php
header("Content-Type: application/json");

if (!isset($_POST['titulo'], $_POST['descripcion'], $_POST['valor_puntos'], $_POST['id_curso'])) {
    echo json_encode(["success" => false, "error" => "Faltan parámetros"]);
    exit;
}

$titulo = $_POST['titulo'];
$descripcion = $_POST['descripcion'];
$valor_puntos = intval($_POST['valor_puntos']);
$id_curso = intval($_POST['id_curso']);

require_once "../conexion.php"; // Conexión MySQLI ($conn)

// Insertar en FORO
$sql = "INSERT INTO FORO (titulo, descripcion, valor_puntos, id_curso) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssii", $titulo, $descripcion, $valor_puntos, $id_curso);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}