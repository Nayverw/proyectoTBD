<?php
header('Content-Type: application/json; charset=utf-8');
include_once('../conexion.php');

if (!isset($_GET['id_docente'])) {
    echo json_encode(["success" => false, "error" => "Falta id_docente"]);
    exit();
}

$id_docente = intval($_GET['id_docente']);

try {
    // 1️⃣ Traer cursos del docente
    $stmt = $conn->prepare("SELECT * FROM curso WHERE id_docente = ?");
    $stmt->bind_param("i", $id_docente);
    $stmt->execute();
    $res = $stmt->get_result();
    
    $cursos = [];
    while ($row = $res->fetch_assoc()) {
        $cursos[$row['id_tipo_curso']][] = $row;
    }

    // 2️⃣ Traer todos los tipos de curso
    $resTipos = $conn->query("SELECT * FROM tipo_curso");
    $tipos = [];
    while ($t = $resTipos->fetch_assoc()) {
        $tipos[$t['id_tipo_curso']] = $t;
    }

    // 3️⃣ Combinar nombre del tipo de curso en los cursos
    $resultado = [];
    foreach ($cursos as $id_tipo => $lista) {
        foreach ($lista as $curso) {
            $curso['nombre_curso'] = $tipos[$id_tipo]['nombre_curso'] ?? "Sin nombre";
            $curso['curso_extra'] = $tipos[$id_tipo]['curso_extra'] ?? "0";
            $resultado[] = $curso;
        }
    }

    echo json_encode(["success" => true, "cursos" => $resultado]);

} catch(Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
