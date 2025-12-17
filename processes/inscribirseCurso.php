<?php
header('Content-Type: application/json');
include("../conexion.php");

$id_curso = intval($_POST['id_curso'] ?? 0);
$id_rol_usuario = intval($_POST['id_rol_usuario'] ?? 0);

if (!$id_curso || !$id_rol_usuario) {
    echo json_encode(["success" => false, "mensaje" => "Datos incompletos."]);
    exit();
}

// Verificar si ya está inscrito
$sqlCheck = "SELECT * FROM inscripcion WHERE id_curso = ? AND id_rol_usuario = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("ii", $id_curso, $id_rol_usuario);
$stmtCheck->execute();
$result = $stmtCheck->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "mensaje" => "Ya estás inscrito en este curso."]);
    exit();
}
$stmtCheck->close();

// Obtener puntos del curso
$sqlCurso = "SELECT preciopuntos FROM curso WHERE id_curso = ?";
$stmtCurso = $conn->prepare($sqlCurso);
$stmtCurso->bind_param("i", $id_curso);
$stmtCurso->execute();
$resCurso = $stmtCurso->get_result();
$curso = $resCurso->fetch_assoc();
$stmtCurso->close();

$puntosCurso = intval($curso['preciopuntos'] ?? 0);

// Insertar inscripción
$fecha_inscripcion = date("Y-m-d H:i:s");
$fecha_finalizacion = null;
$costo = 0;
$modalidad = "Online";
$progreso = 0;
$estado = "Activo";

$sqlInsert = "
    INSERT INTO inscripcion 
    (fecha_inscripcion, fecha_finalizacion, costo, modalidad, progreso, estado, id_curso, id_rol_usuario)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
";
$stmt = $conn->prepare($sqlInsert);
$stmt->bind_param(
    "ssidsdii",
    $fecha_inscripcion,
    $fecha_finalizacion,
    $costo,
    $modalidad,
    $progreso,
    $estado,
    $id_curso,
    $id_rol_usuario
);

if ($stmt->execute()) {

    // ================================
    // ACTUALIZAR PUNTOS
    // ================================
    $sqlGestion = "UPDATE gestion_puntos 
                   SET total_puntos_acumulados = total_puntos_acumulados + ?, 
                       total_puntos_actuales = total_puntos_actuales + ? 
                   WHERE id_rol_usuario = ?";
    $stmtGestion = $conn->prepare($sqlGestion);
    $stmtGestion->bind_param("iii", $puntosCurso, $puntosCurso, $id_rol_usuario);
    $stmtGestion->execute();
    $stmtGestion->close();

    // =========================================
    // INSERTAR BITÁCORA DE INSCRIPCIÓN (TIPO 2)
    // =========================================
   $sqlBit = "
INSERT INTO bitacora 
(accion, descripcion, tabla_afectada, id_rol_usuario, fecha, id_tipo_bitacora)
VALUES (?, ?, ?, ?, NOW(), 0)
";
$stmtBit = $conn->prepare($sqlBit);
$stmtBit->bind_param("sssi", 
    $accion,
    $descripcion,
    $tabla,
    $id_rol_usuario
);
$stmtBit->execute();
$stmtBit->close();




    // =========================================
    // INSERTAR BITÁCORA DE PUNTOS (TIPO 4)
    // =========================================
 $sqlBitPts = "
INSERT INTO bitacora 
(accion, descripcion, tabla_afectada, id_rol_usuario, fecha, id_tipo_bitacora)
VALUES (Gano puntos, Usuario gano puntos, gestionPuntos, ?, NOW(), 0)
";
$stmtBitPts = $conn->prepare($sqlBitPts);
$stmtBitPts->bind_param("i", 
    $accionPts,
    $descripcionPts,
    $tablaPts,
    $id_rol_usuario
);
$stmtBitPts->execute();
$stmtBitPts->close();




    echo json_encode([
        "success" => true,
        "mensaje" => "✅ Inscripción exitosa al curso. Has ganado $puntosCurso puntos."
    ]);

} else {
    echo json_encode(["success" => false, "mensaje" => "❌ Error al inscribirse: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
