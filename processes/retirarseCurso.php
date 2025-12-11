<?php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(E_ALL);

include_once(__DIR__ . '/../conexion.php');

// Validación
if (!isset($_POST['id_curso']) || !isset($_POST['id_rol_usuario'])) {
    echo json_encode(["success" => false, "error" => "Faltan parámetros"]);
    exit();
}

$id_curso = intval($_POST['id_curso']);
$id_rol_usuario = intval($_POST['id_rol_usuario']);

try {

    // 1️⃣  Buscar la inscripción
    $sqlGet = "SELECT id_inscripcion FROM inscripcion WHERE id_curso = ? AND id_rol_usuario = ?";
    $stmtGet = $conn->prepare($sqlGet);
    $stmtGet->bind_param("ii", $id_curso, $id_rol_usuario);
    $stmtGet->execute();
    $res = $stmtGet->get_result();

    if ($res->num_rows === 0) {
        echo json_encode(["success" => false, "error" => "No estabas inscrito en este curso"]);
        exit();
    }

    $row = $res->fetch_assoc();
    $id_inscripcion = $row['id_inscripcion'];
    $stmtGet->close();


    // 2️⃣  Borrar primero de pago
    $sqlPago = "DELETE FROM pago WHERE id_inscripcion = ?";
    $stmtPago = $conn->prepare($sqlPago);
    $stmtPago->bind_param("i", $id_inscripcion);
    $stmtPago->execute();
    $stmtPago->close();


   // 3️⃣  Borrar inscripción
$sqlDel = "DELETE FROM inscripcion WHERE id_inscripcion = ?";
$stmtDel = $conn->prepare($sqlDel);
$stmtDel->bind_param("i", $id_inscripcion);
$stmtDel->execute();

if ($stmtDel->affected_rows > 0) {

    // ===================================
    //   BITÁCORA - RETIRO DE CURSO (TIPO 5)
    // ===================================
    $accion = "Retiro de curso";
    $descripcion = "El usuario se retiró del curso con ID $id_curso";
    $tabla = "inscripcion";

    $sqlBit = "
    INSERT INTO bitacora 
    (accion, descripcion, tabla_afectada, id_rol_usuario, fecha, id_tipo_bitacora)
    VALUES (?, ?, ?, ?, NOW(), 5)
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

    echo json_encode([
        "success" => true,
        "mensaje" => "Te has retirado del curso exitosamente."
    ]);

} else {
    echo json_encode([
        "success" => false,
        "error" => "Error inesperado: no se pudo retirar."
    ]);
}

$stmtDel->close();
$conn->close();


} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
