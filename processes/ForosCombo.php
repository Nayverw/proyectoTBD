<?php
// C:\xampp\htdocs\proyectoTBD\processes\ForosCombo.php
header("Content-Type: application/json");

// Validación
if (!isset($_POST['id_rol_usuario'])) {
    echo json_encode(["error" => "No se recibió id_rol_usuario"]);
    exit;
}

$idRolUsuario = intval($_POST['id_rol_usuario']);

require_once "../conexion.php"; // Conexión MySQLI ($conn)

// 1. Obtener cursos del docente que aún no tienen foro
$sql = "
    SELECT c.id_curso, tc.nombre_curso
    FROM CURSO c
    INNER JOIN TIPO_CURSO tc ON c.id_tipo_curso = tc.id_tipo_curso
    LEFT JOIN FORO f ON c.id_curso = f.id_curso
    WHERE c.id_docente = ? AND f.id_curso IS NULL
";
$query = $conn->prepare($sql);
$query->bind_param("i", $idRolUsuario);
$query->execute();
$result = $query->get_result();

$cursosDisponibles = [];
while ($row = $result->fetch_assoc()) {
    $cursosDisponibles[] = $row;
}

echo json_encode($cursosDisponibles);