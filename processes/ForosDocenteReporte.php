<?php
header("Content-Type: application/json");
require_once("../conexion.php");

$idForo = $_GET["idForo"];

// 1. OBTENER CURSO DEL FORO
$sqlCurso = "SELECT id_curso FROM FORO WHERE id_foro = ?";
$stmtCurso = $conn->prepare($sqlCurso);
$stmtCurso->bind_param("i", $idForo);
$stmtCurso->execute();
$resCurso = $stmtCurso->get_result();

if ($resCurso->num_rows === 0) {
    echo json_encode([]);
    exit;
}

$rowCurso = $resCurso->fetch_assoc();
$idCurso = $rowCurso["id_curso"];


// 2. CONSULTAR SOLO ESTUDIANTES INSCRITOS EN ESTE CURSO
$sql = "
    SELECT 
        CONCAT(U.nombres, ' ', U.apellidos) AS nombre,
        RU.id_rol_usuario AS idRolUsuario,

        -- Cantidad de preguntas realizadas por este estudiante
        (
            SELECT COUNT(*) 
            FROM PREGUNTA_FORO PF
            WHERE PF.id_foro = ?
              AND PF.id_rol_usuario = RU.id_rol_usuario
        ) AS preguntas,

        -- Cantidad de respuestas realizadas por este estudiante
        (
            SELECT COUNT(*) 
            FROM RESPUESTA_PREGUNTA RP
            INNER JOIN PREGUNTA_FORO PF2 
                ON PF2.id_pregunta_foro = RP.id_pregunta_foro
            WHERE PF2.id_foro = ?
              AND RP.id_rol_usuario = RU.id_rol_usuario
        ) AS respuestas

    FROM INSCRIPCION I
    INNER JOIN ROL_USUARIO RU ON RU.id_rol_usuario = I.id_rol_usuario
    INNER JOIN USUARIO U ON U.id_usuario = RU.id_usuario
    INNER JOIN ROL R ON R.id_rol = RU.id_rol

    WHERE I.id_curso = ?
      AND R.nombre != 'Docente'
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iii", $idForo, $idForo, $idCurso);
$stmt->execute();
$result = $stmt->get_result();

$lista = [];

while ($row = $result->fetch_assoc()) {
    $lista[] = [
        "nombre" => $row["nombre"],
        "preguntas" => intval($row["preguntas"]),
        "respuestas" => intval($row["respuestas"])
    ];
}

echo json_encode($lista);