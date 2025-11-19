<?php
// processes/canjearRecompensa.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../conexion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$id_recompensa = intval($_POST['id_recompensa'] ?? 0);
$id_rol_usuario = intval($_POST['id_rol_usuario'] ?? 0);

if (!$id_recompensa || !$id_rol_usuario) {
    echo json_encode(['success' => false, 'error' => 'Parámetros incompletos']);
    exit;
}

$conn->begin_transaction();
try {
    // 1) obtener precio y id_tipo_recompensa
    $sql = "SELECT precio_puntos, id_tipo_recompensa FROM recompensa WHERE id_recompensa = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_recompensa);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows === 0) {
        throw new Exception("Recompensa no encontrada");
    }
    $row = $res->fetch_assoc();
    $precio = intval($row['precio_puntos']);
    $id_tipo_recompensa = intval($row['id_tipo_recompensa']);
    $stmt->close();

    // 2) verificar puntos actuales
    $sql = "SELECT total_puntos_actuales FROM GESTION_PUNTOS WHERE id_rol_usuario = ? FOR UPDATE";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_rol_usuario);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows === 0) {
        throw new Exception("Registro de gestión de puntos no encontrado.");
    }
    $row = $res->fetch_assoc();
    $puntosActuales = intval($row['total_puntos_actuales']);
    $stmt->close();

    if ($puntosActuales < $precio) {
        throw new Exception("No tienes puntos suficientes.");
    }

    // 3) actualizar gestion_puntos
    $nuevo_total_gastado = null;
    //Vamos a incrementar total_puntos_gastados y decrementar total_puntos_actuales
    //Obtenemos totales actuales (para seguridad) y actualizamos
    $sqlGet = "SELECT total_puntos_gastados, total_puntos_acumulados FROM GESTION_PUNTOS WHERE id_rol_usuario = ?";
    $stmt = $conn->prepare($sqlGet);
    $stmt->bind_param("i", $id_rol_usuario);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $total_gastados = intval($row['total_puntos_gastados'] ?? 0);
    $total_acumulados = intval($row['total_puntos_acumulados'] ?? 0);
    $stmt->close();

    $nuevo_total_gastados = $total_gastados + $precio;
    $nuevo_total_actuales = $puntosActuales - $precio;

    $sqlUpd = "UPDATE GESTION_PUNTOS SET total_puntos_gastados = ?, total_puntos_actuales = ? WHERE id_rol_usuario = ?";
    $stmt = $conn->prepare($sqlUpd);
    $stmt->bind_param("iii", $nuevo_total_gastados, $nuevo_total_actuales, $id_rol_usuario);
    if (!$stmt->execute()) {
        throw new Exception("Error actualizando puntos: " . $stmt->error);
    }
    $stmt->close();

    // 4) insertar en canje_recompensa
    $fecha_usado = date("Y-m-d H:i:s");
    // Asumo que la tabla canje_recompensa tiene columnas: id_recompensa, usado, fecha_usado, id_tipo_recompensa, id_rol_usuario
    $sqlIns = "INSERT INTO canje_recompensa (id_recompensa, usado, fecha_usado, id_tipo_recompensa, id_rol_usuario) VALUES (?, 1, ?, ?, ?)";
    $stmt = $conn->prepare($sqlIns);
    $stmt->bind_param("isii", $id_recompensa, $fecha_usado, $id_tipo_recompensa, $id_rol_usuario);
    if (!$stmt->execute()) {
        throw new Exception("Error insertando canje: " . $stmt->error);
    }
    $stmt->close();

    $conn->commit();
    echo json_encode([
        'success' => true,
        'mensaje' => 'Recompensa canjeada correctamente',
        'puntos_actuales' => $nuevo_total_actuales
    ]);
    exit;

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}
