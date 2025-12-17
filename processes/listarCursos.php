<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../conexion.php';

$sql = "SELECT id_tipo_curso, nombre_curso, curso_extra FROM tipo_curso";
$result = $conn->query($sql);

$cursos = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $cursos[] = $row;
    }
}

echo json_encode($cursos);
