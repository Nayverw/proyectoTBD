<?php
header("Content-Type: application/json");
require_once "../conexion.php";

/*
 Queremos mostrar:
 - Nombre completo del docente
 - Cursos que imparte
 - Tipo de curso
 - Precio en puntos

 Tablas usadas:
 usuario
 rol_usuario (para saber quién es docente → id_rol = 2)
 curso
 tipo_curso
*/

$sql = "
SELECT 
  CONCAT(u.nombres, ' ', u.apellidos) AS nombre_docente,
  c.id_curso,
  tc.nombre_curso AS tipo_curso,
  c.preciopuntos
FROM rol_usuario r
LEFT JOIN usuario u ON r.id_usuario = u.id_usuario
LEFT JOIN curso c ON c.id_docente = r.id_rol_usuario
LEFT JOIN tipo_curso tc ON tc.id_tipo_curso = c.id_tipo_curso
WHERE r.id_rol = 2   -- 2 = docente
ORDER BY nombre_docente ASC
";

$res = $conn->query($sql);

$docentes = [];

while ($row = $res->fetch_assoc()) {
    $docentes[] = $row;
}

echo json_encode($docentes);
?>
