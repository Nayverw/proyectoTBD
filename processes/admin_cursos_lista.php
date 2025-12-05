<?php
header("Content-Type: application/json; charset=UTF-8");

include "../conexion.php";

$sql = "SELECT id_tipo_curso, nombre_curso, curso_extra FROM tipo_curso";
$result = $conn->query($sql);

$cursos = [];

if ($result && $result->num_rows > 0) {
    while ($fila = $result->fetch_assoc()) {
        $cursos[] = $fila;
    }
}

// Si hay un error SQL, lo mostramos como JSON v�lido
if (!$result) {
    echo json_encode(["error" => $conn->error]);
    exit;
}

echo json_encode($cursos);
$conn->close();
?>