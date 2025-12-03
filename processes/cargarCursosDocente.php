<?php
// C:\xampp\htdocs\proyectoTBD\processes\cargarCursosDocente.php
header('Content-Type: application/json');
include("../conexion.php");

// 🔹 Obtener id del docente
$id_docente = intval($_GET['id_docente'] ?? 0);
if (!$id_docente) {
    echo json_encode([
        "success" => false,
        "mensaje" => "Falta id_docente",
        "cursos" => []
    ]);
    exit();
}

// 🔹 Traer cursos dictados por este docente
$sql = "
    SELECT c.id_curso, c.id_tipo_curso, tc.nombre_curso, c.estado, c.cupo
    FROM curso c
    JOIN tipo_curso tc ON c.id_tipo_curso = tc.id_tipo_curso
    WHERE c.id_docente = ?
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_docente);
$stmt->execute();
$result = $stmt->get_result();

$cursos = [];
while ($row = $result->fetch_assoc()) {
    $cursos[] = [
        "id_curso" => $row['id_curso'],
        "id_tipo_curso" => $row['id_tipo_curso'],
        "nombre_curso" => $row['nombre_curso'],
        "estado" => $row['estado'],
        "cupo" => $row['cupo']
    ];
}

$stmt->close();
$conn->close();

// 🔹 Devolver JSON
echo json_encode([
    "success" => true,
    "mensaje" => "Cursos cargados correctamente",
    "cursos" => $cursos
]);
?>
