<?php
header("Content-Type: application/json");
include("../conexion.php");

// Recibir datos
$nombre = trim($_POST["nombre_curso"] ?? "");
$curso_extra = trim($_POST["curso_extra"] ?? "NO");
$preciopuntos = floatval($_POST["preciopuntos"] ?? 0);
$duracion = floatval($_POST["duracion"] ?? 0);
$cupo = intval($_POST["cupo"] ?? 0);
$estado = trim($_POST["estado"] ?? "ACTIVO");
$id_docente = intval($_POST["id_docente"] ?? 0);
$id_horario = intval($_POST["id_horario"] ?? 0);

// Validar datos obligatorios
if (!$nombre || !$id_docente || !$id_horario) {
    echo json_encode([
        "success" => false,
        "mensaje" => "Datos incompletos: nombre, docente y horario son obligatorios"
    ]);
    exit();
}

$conn->begin_transaction();

try {

    // ----------------------------------------
    // 1. Insertar en tipo_curso
    // ----------------------------------------

    $stmt1 = $conn->prepare("
        INSERT INTO tipo_curso (nombre_curso, curso_extra) 
        VALUES (?, ?)
    ");
    $stmt1->bind_param("ss", $nombre, $curso_extra);
    $stmt1->execute();

    $id_tipo_curso = $stmt1->insert_id;


    // ----------------------------------------
    // 2. Insertar en curso
    // ----------------------------------------

    $stmt2 = $conn->prepare("
        INSERT INTO curso 
        (preciopuntos, duracion, cupo, estado, id_tipo_curso, id_docente) 
        VALUES (?,?,?,?,?,?)
    ");

    $stmt2->bind_param(
        "ddissi",
        $preciopuntos,
        $duracion,
        $cupo,
        $estado,
        $id_tipo_curso,
        $id_docente
    );

    $stmt2->execute();
    $id_curso = $stmt2->insert_id;


    // ----------------------------------------
    // 3. Validar si el horario ya está asignado (opcional)
    // ----------------------------------------
    /*
    $stmtCheck = $conn->prepare("SELECT id_curso FROM horario WHERE id_horario=?");
    $stmtCheck->bind_param("i", $id_horario);
    $stmtCheck->execute();
    $stmtCheck->bind_result($cursoExistente);
    $stmtCheck->fetch();

    if ($cursoExistente) {
        throw new Exception("El horario ya está asignado a un curso");
    }
    */


    // ----------------------------------------
    // 4. Actualizar horario con el id del curso
    // ----------------------------------------

    $stmt3 = $conn->prepare("
        UPDATE horario 
        SET id_curso=? 
        WHERE id_horario=?
    ");
    $stmt3->bind_param("ii", $id_curso, $id_horario);
    $stmt3->execute();


    // ----------------------------------------
    // 5. Commit
    // ----------------------------------------

    $conn->commit();

    echo json_encode([
        "success" => true,
        "mensaje" => "Curso creado correctamente",
        "id_curso" => $id_curso
    ]);


} catch (Exception $e) {

    $conn->rollback();

    echo json_encode([
        "success" => false,
        "mensaje" => "Error al crear curso: " . $e->getMessage()
    ]);
}

$conn->close();
?>
