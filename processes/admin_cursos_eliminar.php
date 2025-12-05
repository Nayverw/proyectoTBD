<?php
require_once "../conexion.php";

if (!isset($_POST['id_curso'])) {
    echo "Error: No se recibi� el id del curso.";
    exit;
}

$id = $_POST['id_curso'];

$stmt = $conexion->prepare("DELETE FROM tipo_curso WHERE id_tipo_curso = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo "Curso eliminado correctamente.";
} else {
    echo "No se pudo eliminar el curso.";
}