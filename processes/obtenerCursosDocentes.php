<?php
header('Content-Type: application/json; charset=utf-8');
include_once('../conexion.php');

if (!isset($_GET['id_docente'])) {
    echo json_encode(["success" => false, "error" => "Falta id_docente"]);
    exit();
}

$id_docente = intval($_GET['id_docente']);

try {
    $sql = "
        SELECT c.id_curso, c.preciopuntos, c.estado, c.duracion, c.cupo, c.id_tipo_curso,
               t.nombre_curso
        FROM curso c
        LEFT JOIN tipo_curso t ON t.id_tipo_curso = c.id_tipo_curso
        WHERE c.id_docente = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_docente);
    $stmt->execute();
    $res = $stmt->get_result();

    $cursos = [];
    while ($row = $res->fetch_assoc()) {
        $cursos[] = [
            "id_curso" => $row['id_curso'],
            "nombre_curso" => $row['nombre_curso'] ?? "Sin nombre",
            "preciopuntos" => $row['preciopuntos'],
            "estado" => $row['estado'],
            "duracion" => $row['duracion'],
            "cupo" => $row['cupo'],
            "id_tipo_curso" => $row['id_tipo_curso']
        ];
    }

    echo json_encode(["success" => true, "cursos" => $cursos]);
} catch(Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
