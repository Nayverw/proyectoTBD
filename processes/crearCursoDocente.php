<?php
header('Content-Type: application/json');
include("../conexion.php");

$nombre = $_POST['nombre'];
$extra = $_POST['curso_extra'];
$precio = $_POST['precio'];
$duracion = $_POST['duracion'];
$cupo = $_POST['cupo'];
$id_docente = $_POST['id_docente'];
$dia = $_POST['dia'];
$hora = $_POST['hora'];
$id_aula = $_POST['id_aula'];

/* --------------------------
   VALIDAR AULA DISPONIBLE
--------------------------- */
$sqlCheckAula = "
    SELECT 1 FROM horario 
    WHERE dia = ? AND hora = ? AND id_aula = ?
";
$stmt = $conn->prepare($sqlCheckAula);
$stmt->bind_param("ssi", $dia, $hora, $id_aula);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "mensaje" => "El aula ya está ocupada"]);
    exit();
}

/* --------------------------
   VALIDAR CONFLICTO DE HORARIO DEL DOCENTE
--------------------------- */
$sqlCheckDoc = "
    SELECT 1 FROM horario h
    JOIN curso c ON h.id_curso = c.id_curso
    WHERE c.id_docente = ? AND h.dia = ? AND h.hora = ?
";
$stmt2 = $conn->prepare($sqlCheckDoc);
$stmt2->bind_param("iss", $id_docente, $dia, $hora);
$stmt2->execute();
$stmt2->store_result();

if ($stmt2->num_rows > 0) {
    echo json_encode(["success" => false, "mensaje" => "Ya tienes un curso en ese horario"]);
    exit();
}

/* --------------------------
   CREAR TIPO_CURSO
--------------------------- */
$sqlTipo = "INSERT INTO tipo_curso(nombre_curso, curso_extra) VALUES (?, ?)";
$stmt3 = $conn->prepare($sqlTipo);
$stmt3->bind_param("ss", $nombre, $extra);
$stmt3->execute();
$id_tipo_curso = $stmt3->insert_id;

/* --------------------------
   CREAR CURSO
--------------------------- */
$sqlCurso = "
    INSERT INTO curso(preciopuntos, estado, duracion, cupo, id_tipo_curso, id_docente) 
    VALUES(?, 'activo', ?, ?, ?, ?)
";
$stmt4 = $conn->prepare($sqlCurso);
$stmt4->bind_param("siisi", $precio, $duracion, $cupo, $id_tipo_curso, $id_docente);
$stmt4->execute();
$id_curso = $stmt4->insert_id;

/* --------------------------
   CREAR HORARIO
--------------------------- */
$sqlHorario = "
    INSERT INTO horario(dia, hora, preciopuntos, id_curso, id_aula)
    VALUES(?, ?, 0, ?, ?)
";
$stmt5 = $conn->prepare($sqlHorario);
$stmt5->bind_param("ssii", $dia, $hora, $id_curso, $id_aula);
$stmt5->execute();

echo json_encode(["success" => true, "mensaje" => "Curso creado con éxito"]);
?>
