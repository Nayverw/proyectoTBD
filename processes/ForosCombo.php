<?php
// C:\xampp\htdocs\proyectoTBD\processes\ForosCombo.php
header("Content-Type: application/json");

// Validar entrada
if (!isset($_POST['id_rol_usuario'])) {
    echo json_encode(["error" => "No se recibió id_rol_usuario"]);
    exit;
}

$idDocente = intval($_POST['id_rol_usuario']); // ← ES EL MISMO QUE id_docente EN CURSO

require_once "../conexion.php"; // conexión MySQLi ($conn)

/* -------------------------------------------------------------
   OBTENER LOS CURSOS DEL DOCENTE QUE NO TIENEN FORO CREADO
--------------------------------------------------------------*/

$sql = "
    SELECT c.id_curso, tc.nombre_curso
    FROM CURSO c
    INNER JOIN TIPO_CURSO tc ON c.id_tipo_curso = tc.id_tipo_curso
    LEFT JOIN FORO f ON c.id_curso = f.id_curso
    WHERE c.id_docente = ? 
      AND f.id_curso IS NULL
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idDocente);
$stmt->execute();
$result = $stmt->get_result();

$cursosDisponibles = [];
while ($fila = $result->fetch_assoc()) {
    $cursosDisponibles[] = $fila;
}

echo json_encode($cursosDisponibles);