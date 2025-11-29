<?php
// C:\xampp\htdocs\proyectoTBD\processes\ForosCursos.php
header("Content-Type: application/json");

// Validación
if (!isset($_POST['id_rol_usuario'])) {
    echo json_encode(["error" => "No se recibió id_rol_usuario"]);
    exit;
}

$idRolUsuario = intval($_POST['id_rol_usuario']);

require_once "../conexion.php"; // Conexión MySQLI ($conn)

// 1. Obtener id_curso desde INSCRIPCION
$query1 = $conn->prepare("SELECT id_curso FROM INSCRIPCION WHERE id_rol_usuario = ?");
$query1->bind_param("i", $idRolUsuario);
$query1->execute();
$result1 = $query1->get_result();

$cursos = [];
while ($row = $result1->fetch_assoc()) {
    $cursos[] = $row["id_curso"];
}

if (empty($cursos)) {
    echo json_encode([]); // no está inscrito en cursos
    exit;
}

// 2. Construir listado de placeholders (?, ?, ?, ...)
$placeholders = implode(",", array_fill(0, count($cursos), "?"));

// 3. Obtener foros de esos cursos
$sql = "SELECT id_foro, titulo, descripcion FROM FORO WHERE id_curso IN ($placeholders)";
$query2 = $conn->prepare($sql);

// Tipos dinámicos: si tienes 3 cursos => "iii"
$types = str_repeat("i", count($cursos));

// bind_param requiere parámetros por referencia
$query2->bind_param($types, ...$cursos);

$query2->execute();
$result2 = $query2->get_result();

$foros = [];
while ($row = $result2->fetch_assoc()) {
    $foros[] = $row;
}

echo json_encode($foros);