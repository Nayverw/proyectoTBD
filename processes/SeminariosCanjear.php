<?php
header('Content-Type: application/json');
include "../conexion.php"; // archivo con $conn

if (!isset($_POST['id_rol_usuario']) || !isset($_POST['id_seminario'])) {
    echo json_encode(["estado" => "error", "error" => "Faltan datos."]);
    exit;
}

$idRolUsuario = $_POST['id_rol_usuario'];
$idSeminario = $_POST['id_seminario'];

try {
    // 1Obtener el id_recompensa más antiguo de tipo Seminario para este usuario
    $sql = "
        SELECT cr.id_recompensa
        FROM CANJE_RECOMPENSA cr
        JOIN RECOMPENSA r ON cr.id_tipo_recompensa = r.id_tipo_recompensa
        JOIN TIPO_RECOMPENSA tr ON r.id_tipo_recompensa = tr.id_tipo_recompensa
        WHERE cr.id_rol_usuario = ?
          AND tr.nombre_tipo = 'Seminario'
          AND cr.usado = 'No'
        ORDER BY cr.id_recompensa ASC
        LIMIT 1
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idRolUsuario);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if (!$row) {
        echo json_encode(["estado" => "error", "error" => "No hay recompensas de seminario disponibles para canjear."]);
        exit;
    }

    $idRecompensa = $row['id_recompensa'];

    // 2️⃣ Actualizar el registro
    $sqlUpdate = "UPDATE CANJE_RECOMPENSA SET usado='Si', fecha_usado=NOW() WHERE id_recompensa=?";
    $stmtUpdate = $conn->prepare($sqlUpdate);
    $stmtUpdate->bind_param("i", $idRecompensa);
    $stmtUpdate->execute();

    echo json_encode(["estado" => "ok", "id_recompensa" => $idRecompensa]);

} catch (Exception $e) {
    echo json_encode(["estado" => "error", "error" => $e->getMessage()]);
}
?>