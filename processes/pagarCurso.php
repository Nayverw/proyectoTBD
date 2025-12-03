<?php
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
header('Content-Type: application/json');
include("../conexion.php");

try {
    $id_curso = intval($_POST['id_curso'] ?? 0);
    $id_rol_usuario = intval($_POST['id_rol_usuario'] ?? 0);
    $monto_pagado = floatval($_POST['monto_pagado'] ?? 0);
    $tipo_pago = $_POST['tipo_pago'] ?? '';

    if (!$id_curso || !$id_rol_usuario || !$monto_pagado || !$tipo_pago) {
        throw new Exception("Faltan datos obligatorios para procesar el pago");
    }

    // Verificar si ya estaba inscrito
    $stmtCheck = $conn->prepare("SELECT id_inscripcion FROM inscripcion WHERE id_curso=? AND id_rol_usuario=?");
    $stmtCheck->bind_param("ii", $id_curso, $id_rol_usuario);
    $stmtCheck->execute();
    $resCheck = $stmtCheck->get_result();

    if($resCheck->num_rows > 0){
        throw new Exception("Ya estás inscrito en este curso");
    }
    $stmtCheck->close();

    // Registrar inscripción (solo si el pago es válido)
    $stmtIns = $conn->prepare("INSERT INTO inscripcion (id_curso, id_rol_usuario, fecha_inscripcion, estado) VALUES (?, ?, NOW(), 'Activo')");
    $stmtIns->bind_param("ii", $id_curso, $id_rol_usuario);
    if (!$stmtIns->execute()) {
        throw new Exception("Error al inscribirse: " . $stmtIns->error);
    }
    $id_inscripcion = $stmtIns->insert_id;
    $stmtIns->close();

    // Registrar pago
    $stmtPago = $conn->prepare("INSERT INTO pago (id_inscripcion, fecha_pago, monto_pagado, tipo_pago) VALUES (?, NOW(), ?, ?)");
    $stmtPago->bind_param("ids", $id_inscripcion, $monto_pagado, $tipo_pago);
    if (!$stmtPago->execute()) {
        // Si falla el pago, eliminamos la inscripción
        $conn->query("DELETE FROM inscripcion WHERE id_inscripcion = $id_inscripcion");
        throw new Exception("Error al registrar el pago: " . $stmtPago->error);
    }
    $id_pago = $stmtPago->insert_id;
    $stmtPago->close();

    // Obtener info curso y docente
    $sqlCurso = "
        SELECT c.id_curso, c.preciopuntos, u.nombres, u.apellidos
        FROM curso c
        JOIN rol_usuario ru ON c.id_docente = ru.id_rol_usuario
        JOIN usuario u ON ru.id_usuario = u.id_usuario
        WHERE c.id_curso = ?
    ";
    $stmtCurso = $conn->prepare($sqlCurso);
    $stmtCurso->bind_param("i", $id_curso);
    $stmtCurso->execute();
    $resCurso = $stmtCurso->get_result();
    $curso = $resCurso->fetch_assoc();
    $stmtCurso->close();
    
    $conn->commit();

    echo json_encode([
        "success" => true,
        "voucher" => [
            "id_pago" => $id_pago,
            "curso" => $curso['nombre_curso'],
            "precio" => $curso['preciopuntos'],
            "docente" => trim($curso['nombres']." ".$curso['apellidos']),
            "fecha_pago" => date("d-m-Y H:i:s"),
            "monto_pagado" => $monto_pagado,
            "tipo_pago" => $tipo_pago
        ]
    ]);

} catch (Exception $e) {
    $conn->rollback(); 
    echo json_encode(["success" => false, "mensaje" => $e->getMessage()]);
    exit();
}
?>
