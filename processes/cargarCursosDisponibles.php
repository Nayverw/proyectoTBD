<?php
header('Content-Type: application/json');
include("../conexion.php");

$id_rol_usuario = intval($_GET['id_rol_usuario'] ?? 0);
if (!$id_rol_usuario) {
    echo json_encode(["success" => false, "mensaje" => "Falta id_rol_usuario"]);
    exit();
}

/* ==========================================================
   1. CURSOS INSCRITOS (con cupo, precio, docente, aula, horario)
   ========================================================== */

$sqlInscritos = "
SELECT 
    tc.id_tipo_curso,
    tc.nombre_curso,
    tc.curso_extra,

    c.id_curso,
    c.preciopuntos,
    c.estado,
    c.duracion,
    c.cupo,

    (SELECT COUNT(*) FROM inscripcion WHERE id_curso = c.id_curso) AS inscritos,

    u.nombres AS docente_nombres,
    u.apellidos AS docente_apellidos,

    a.nombre AS aula_nombre,
    a.ubicacion AS aula_ubicacion,
    a.descripcion AS aula_descripcion,

    h.id_horario,
    h.dia,
    h.hora,
    h.valor_puntos

FROM inscripcion i
JOIN curso c ON i.id_curso = c.id_curso
JOIN tipo_curso tc ON c.id_tipo_curso = tc.id_tipo_curso
JOIN rol_usuario ru ON c.id_docente = ru.id_rol_usuario
JOIN usuario u ON ru.id_usuario = u.id_usuario
LEFT JOIN horario h ON c.id_curso = h.id_curso
LEFT JOIN aula a ON h.id_aula = a.id_aula

WHERE i.id_rol_usuario = ?
ORDER BY tc.nombre_curso
";

$stmtIns = $conn->prepare($sqlInscritos);
$stmtIns->bind_param("i", $id_rol_usuario);
$stmtIns->execute();
$resultIns = $stmtIns->get_result();

$tmp = [];
while ($row = $resultIns->fetch_assoc()) {
    $id = $row["id_curso"];
    if (!isset($tmp[$id])) {
        $tmp[$id] = [
            "id_curso" => $row["id_curso"],
            "id_tipo_curso" => $row["id_tipo_curso"],
            "nombre_curso" => $row["nombre_curso"],
            "curso_extra" => $row["curso_extra"],
            "precio" => $row["preciopuntos"],
            "estado" => $row["estado"],
            "duracion" => $row["duracion"],
            "cupo" => $row["cupo"],
            "inscritos" => intval($row["inscritos"]),
            "docente" => trim($row["docente_nombres"] . " " . $row["docente_apellidos"]),
            "aula" => $row["aula_nombre"],
            "ubicacion" => $row["aula_ubicacion"],
            "descripcion_aula" => $row["aula_descripcion"],
            "horarios" => []
        ];
    }

    if ($row["id_horario"]) {
        $tmp[$id]["horarios"][] = [
            "dia" => $row["dia"],
            "hora" => $row["hora"],
            "valor_puntos" => $row["valor_puntos"]
        ];
    }
}

$cursosInscritos = array_values($tmp);
$stmtIns->close();

/* ==========================================================
   2. CURSOS DISPONIBLES (que no esté inscrito y con detalle)
   ========================================================== */

$sqlDisp = "
SELECT 
    tc.id_tipo_curso,
    tc.nombre_curso,
    tc.curso_extra,

    c.id_curso,
    c.preciopuntos,
    c.estado,
    c.duracion,
    c.cupo,

    (SELECT COUNT(*) FROM inscripcion WHERE id_curso = c.id_curso) AS inscritos,

    u.nombres AS docente_nombres,
    u.apellidos AS docente_apellidos,

    a.nombre AS aula_nombre,
    a.ubicacion AS aula_ubicacion,
    a.descripcion AS aula_descripcion,

    h.id_horario,
    h.dia,
    h.hora,
    h.valor_puntos

FROM curso c
JOIN tipo_curso tc ON c.id_tipo_curso = tc.id_tipo_curso
JOIN rol_usuario ru ON c.id_docente = ru.id_rol_usuario
JOIN usuario u ON ru.id_usuario = u.id_usuario
LEFT JOIN horario h ON c.id_curso = h.id_curso
LEFT JOIN aula a ON h.id_aula = a.id_aula

WHERE c.id_curso NOT IN (
    SELECT id_curso FROM inscripcion WHERE id_rol_usuario = ?
)
ORDER BY tc.nombre_curso
";

$stmtDisp = $conn->prepare($sqlDisp);
$stmtDisp->bind_param("i", $id_rol_usuario);
$stmtDisp->execute();
$resultDisp = $stmtDisp->get_result();

$tmp = [];
while ($row = $resultDisp->fetch_assoc()) {
    $id = $row["id_curso"];
    if (!isset($tmp[$id])) {
        $tmp[$id] = [
            "id_curso" => $row["id_curso"],
            "id_tipo_curso" => $row["id_tipo_curso"],
            "nombre_curso" => $row["nombre_curso"],
            "curso_extra" => $row["curso_extra"],
            "precio" => $row["preciopuntos"],
            "estado" => $row["estado"],
            "duracion" => $row["duracion"],
            "cupo" => $row["cupo"],
            "inscritos" => intval($row["inscritos"]),
            "docente" => trim($row["docente_nombres"] . " " . $row["docente_apellidos"]),
            "aula" => $row["aula_nombre"],
            "ubicacion" => $row["aula_ubicacion"],
            "descripcion_aula" => $row["aula_descripcion"],
            "horarios" => []
        ];
    }

    if ($row["id_horario"]) {
        $tmp[$id]["horarios"][] = [
            "dia" => $row["dia"],
            "hora" => $row["hora"],
            "valor_puntos" => $row["valor_puntos"]
        ];
    }
}

$cursosDisponibles = array_values($tmp);
$stmtDisp->close();
$conn->close();

/* ==========================================================
   3. RESPUESTA JSON
   ========================================================== */

echo json_encode([
    "success" => true,
    "cursos_inscritos" => $cursosInscritos,
    "cursos_disponibles" => $cursosDisponibles
]);
?>
