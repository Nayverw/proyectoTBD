<?php
// C:\xampp\htdocs\proyectoTBD\processes\ForosDocente.php
header("Content-Type: application/json");

// Validación básica
if (!isset($_POST['id_rol_usuario'])) {
    echo json_encode(["error" => "No se recibió id_rol_usuario"]);
    exit;
}

$idRolUsuario = intval($_POST['id_rol_usuario']);

require_once "../conexion.php";  // Conexión MySQLi ($conn)

/*
    1. Obtener cursos donde este id_rol_usuario es el DOCENTE
    En tu BD, CURSO.id_docente => referencia a ROL_USUARIO.id_rol_usuario
*/

$query1 = $conn->prepare("
    SELECT id_curso 
    FROM CURSO 
    WHERE id_docente = ?
");
$query1->bind_param("i", $idRolUsuario);
$query1->execute();
$result1 = $query1->get_result();

// Guardar IDs de cursos
$cursos = [];
while ($row = $result1->fetch_assoc()) {
    $cursos[] = $row["id_curso"];
}

if (empty($cursos)) {
    // No tiene cursos asignados
    echo json_encode([]);
    exit;
}

/*
    2. Crear placeholders (?, ?, ?, ...)
*/
$placeholders = implode(",", array_fill(0, count($cursos), "?"));

/*
    3. Obtener los foros de esos cursos
*/
$sql = "SELECT id_foro, titulo, descripcion 
        FROM FORO 
        WHERE id_curso IN ($placeholders)";

$query2 = $conn->prepare($sql);

// Construir tipos dinámicos para bind_param
$types = str_repeat("i", count($cursos));

// Importante: parámetros por referencia
$query2->bind_param($types, ...$cursos);

$query2->execute();
$result2 = $query2->get_result();

// Foros resultantes
$foros = [];
while ($row = $result2->fetch_assoc()) {
    $foros[] = $row;
}

echo json_encode($foros);