<?php
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
header('Content-Type: application/json');
include("../conexion.php");

$conn->begin_transaction();

try {
    $id_curso = intval($_POST['id_curso'] ?? 0);
    $id_rol_usuario = intval($_POST['id_rol_usuario'] ?? 0);
    $monto_pagado = floatval($_POST['monto_pagado'] ?? 0);
    $tipo_pago = $_POST['tipo_pago'] ?? '';

    if (!$id_curso || !$id_rol_usuario || !$monto_pagado || !$tipo_pago) {
        throw new Exception("Faltan datos obligatorios para procesar el pago");
    }

    // Verificar si ya estaba inscrito
    $stmtCheck = $conn->prepare(
        "SELECT id_inscripcion 
         FROM inscripcion 
         WHERE id_curso=? AND id_rol_usuario=?"
    );
    $stmtCheck->bind_param("ii", $id_curso, $id_rol_usuario);
    $stmtCheck->execute();
    $resCheck = $stmtCheck->get_result();
    if ($resCheck->num_rows > 0) {
        throw new Exception("Ya estás inscrito en este curso");
    }
    $stmtCheck->close();

    // Registrar inscripción
    $stmtIns = $conn->prepare(
        "INSERT INTO inscripcion (id_curso, id_rol_usuario, fecha_inscripcion, estado)
         VALUES (?, ?, NOW(), 'Activo')"
    );
    $stmtIns->bind_param("ii", $id_curso, $id_rol_usuario);
    if (!$stmtIns->execute()) {
        throw new Exception("Error al inscribirse: " . $stmtIns->error);
    }
    $id_inscripcion = $stmtIns->insert_id;
    $stmtIns->close();

    // Registrar pago
    $stmtPago = $conn->prepare(
        "INSERT INTO pago (id_inscripcion, fecha_pago, monto_pagado, tipo_pago)
         VALUES (?, NOW(), ?, ?)"
    );
    $stmtPago->bind_param("ids", $id_inscripcion, $monto_pagado, $tipo_pago);
    if (!$stmtPago->execute()) {
        $conn->query("DELETE FROM inscripcion WHERE id_inscripcion = $id_inscripcion");
        throw new Exception("Error al registrar el pago: " . $stmtPago->error);
    }
    $id_pago = $stmtPago->insert_id;
    $stmtPago->close();

    // =====================
    // Bitácora del pago
    // =====================
    $accion = "Pago de curso";
    $descripcion = "El usuario ID $id_rol_usuario realizó un pago de $monto_pagado Bs. para el curso ID $id_curso";
    $tabla = "pago";
    $id_tipo_bitacora = 6;

    $sqlBit = "
        INSERT INTO bitacora (accion, descripcion, tabla_afectada, id_rol_usuario, id_tipo_bitacora, fecha)
        VALUES (?, ?, ?, ?, ?, NOW())
    ";
    $stmtBit = $conn->prepare($sqlBit);
    $stmtBit->bind_param("sssii", $accion, $descripcion, $tabla, $id_rol_usuario, $id_tipo_bitacora);
    $stmtBit->execute();
    $stmtBit->close();

    // =====================
    // Obtener info del curso (CORREGIDO)
    // =====================
    $sqlCurso = "
        SELECT 
            c.id_curso,
            tc.nombre_curso,
            c.preciopuntos,
            u.nombres,
            u.apellidos
        FROM curso c
        INNER JOIN tipo_curso tc ON tc.id_tipo_curso = c.id_tipo_curso
        INNER JOIN rol_usuario ru ON ru.id_rol_usuario = c.id_docente
        INNER JOIN usuario u ON u.id_usuario = ru.id_usuario
        WHERE c.id_curso = ?
    ";
    $stmtCurso = $conn->prepare($sqlCurso);
    $stmtCurso->bind_param("i", $id_curso);
    $stmtCurso->execute();
    $resCurso = $stmtCurso->get_result();
    $curso = $resCurso->fetch_assoc();
    $stmtCurso->close();

    // Actualizar puntos del estudiante
    $puntosCurso = intval($curso['preciopuntos'] ?? 0);
    if ($puntosCurso > 0) {
        $stmtPuntos = $conn->prepare("
            UPDATE gestion_puntos 
            SET total_puntos_acumulados = total_puntos_acumulados + ?, 
                total_puntos_actuales = total_puntos_actuales + ? 
            WHERE id_rol_usuario = ?
        ");
        $stmtPuntos->bind_param("iii", $puntosCurso, $puntosCurso, $id_rol_usuario);
        $stmtPuntos->execute();
        $stmtPuntos->close();
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "mensaje" => "Inscripción y pago exitosos. Has ganado $puntosCurso puntos.",
        "voucher" => [
            "id_pago" => $id_pago,
            "id_curso" => $curso['id_curso'],
            "nombre_curso" => $curso['nombre_curso'],
            "precio_puntos" => $curso['preciopuntos'],
            "docente" => trim($curso['nombres'] . " " . $curso['apellidos']),
            "fecha_pago" => date("d-m-Y H:i:s"),
            "monto_pagado" => $monto_pagado,
            "tipo_pago" => $tipo_pago
        ]
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        "success" => false,
        "mensaje" => $e->getMessage()
    ]);
    exit();
}
?>
