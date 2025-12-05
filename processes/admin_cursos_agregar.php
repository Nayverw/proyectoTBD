<?php
require_once "../conexion.php";

// Verificar que se reciban los datos necesarios
if (!isset($_POST['nombre_curso']) || !isset($_POST['curso_extra'])) {
    echo "Error: Datos incompletos";
    exit;
}

$nombre = $_POST['nombre_curso'];
$extra = $_POST['curso_extra'];

// Preparar la inserci�n en la base de datos
$stmt = $conexion->prepare("INSERT INTO tipo_curso (nombre_curso, curso_extra) VALUES (?, ?)");
$stmt->bind_param("ss", $nombre, $extra);

// Ejecutar y enviar mensaje de �xito o error
if ($stmt->execute()) {
    echo "Curso agregado correctamente";
} else {
    echo "Error al agregar curso: " . $stmt->error;
}

$stmt->close();
$conexion->close();
