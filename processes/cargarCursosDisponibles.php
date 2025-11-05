<?php
header('Content-Type: application/json');
include("../conexion.php");

// Obtener los cursos disponibles
$sql = "
    SELECT 
        c.id_curso,
        tc.nombre_curso,
        tc.descripcion,
        c.estado
    FROM CURSO c
    JOIN TIPO_CURSO tc ON c.id_tipo_curso = tc.id_tipo_curso
    WHERE c.estado = 'ACTIVO'
";

$result = $conn->query($sql);
$cursos = [];

while ($row = $result->fetch_assoc()) {
    $cursos[] = [
        "id_curso" => $row["id_curso"],
        "nombre_curso" => $row["nombre_curso"],
        "descripcion" => $row["descripcion"],
        "estado" => $row["estado"]
    ];
}

if (count($cursos) > 0) {
    echo json_encode(["success" => true, "cursos" => $cursos]);
} else {
    echo json_encode(["success" => false, "mensaje" => "No hay cursos activos disponibles."]);
}

$conn->close();
?>
