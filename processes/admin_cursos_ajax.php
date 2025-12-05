<?php
header('Content-Type: application/json; charset=UTF-8');
error_reporting(0); // Evita warnings que rompan JSON
require_once "../conexion.php";

// Inicializamos arrays
$cursos = [];
$docentes = [];

// --- Verificar conexi�n ---
if (!$conexion) {
    echo json_encode([
        "success" => false,
        "error" => "Error de conexi�n a la base de datos",
        "cursos" => [],
        "docentes" => []
    ]);
    exit;
}

// --- Obtener cursos ---
$sql_cursos = "SELECT id_tipo_curso, nombre_curso, curso_extra FROM tipo_curso";
if ($result = $conexion->query($sql_cursos)) {
    while ($row = $result->fetch_assoc()) {
        $cursos[] = $row;
    }
}

// --- Obtener docentes (rol 2) ---
$sql_docentes = "
    SELECT u.id_usuario, u.nombres, u.apellidos
    FROM usuario u
    INNER JOIN rol_usuario r ON u.id_usuario = r.id_usuario
    WHERE r.id_rol = 2
";

if ($result2 = $conexion->query($sql_docentes)) {
    while ($row = $result2->fetch_assoc()) {
        $docentes[] = $row;
    }
}

// --- Retornar JSON limpio ---
echo json_encode([
    "success" => true,
    "cursos" => $cursos,
    "docentes" => $docentes
]);

exit;
