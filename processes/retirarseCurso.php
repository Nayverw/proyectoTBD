<?php
// processes/retirarseCurso.php
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Conexión
$conexionPath = __DIR__ . '/../conexion.php';
if (!file_exists($conexionPath)) {
    echo json_encode(["success" => false, "error" => "No se encontró conexion.php"]);
    exit();
}
include_once($conexionPath);

// Validación
if (!isset($_POST['id_curso']) || !isset($_POST['id_rol_usuario'])) {
    echo json_encode(["success" => false, "error" => "Faltan parámetros"]);
    exit();
}

$id_curso = intval($_POST['id_curso']);
$id_rol_usuario = intval($_POST['id_rol_usuario']);

try {
    // Eliminar la inscripción REAL
    $sql = "DELETE FROM INSCRIPCION WHERE id_curso = ? AND id_rol_usuario = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error en la preparación: " . $conn->error);
    }

    $stmt->bind_param("ii", $id_curso, $id_rol_usuario);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "mensaje" => "Te has retirado del curso exitosamente."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => "No estabas inscrito en este curso."
        ]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
