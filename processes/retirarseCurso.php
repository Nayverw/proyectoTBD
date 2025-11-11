<?php
// processes/retirarseCurso.php
// 🔹 Simula el retiro de un curso sin eliminarlo realmente de la base de datos
header('Content-Type: application/json; charset=utf-8');

// Evita que errores HTML rompan el JSON
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Conexión a la base
$conexionPath = __DIR__ . '/../conexion.php';
if (!file_exists($conexionPath)) {
    echo json_encode(["success" => false, "error" => "No se encontró conexion.php en la ruta esperada."]);
    exit();
}
include_once($conexionPath);

// Validaciones básicas
if (!isset($_POST['id_curso']) || !isset($_POST['id_rol_usuario'])) {
    echo json_encode(["success" => false, "error" => "Faltan parámetros (id_curso o id_rol_usuario)."]);
    exit();
}

$id_curso = intval($_POST['id_curso']);
$id_rol_usuario = intval($_POST['id_rol_usuario']);

// En versiones anteriores este bloque eliminaba la inscripción en la base:
//
// try {
//     $sql = "DELETE FROM INSCRIPCION WHERE id_curso = ? AND id_rol_usuario = ?";
//     $stmt = $conn->prepare($sql);
//     if (!$stmt) {
//         throw new Exception("Error en la preparación de la consulta: " . $conn->error);
//     }
//     $stmt->bind_param("ii", $id_curso, $id_rol_usuario);
//     if (!$stmt->execute()) {
//         throw new Exception("Error al ejecutar la consulta: " . $stmt->error);
//     }
//     $affected = $stmt->affected_rows;
//     $stmt->close();
//     $conn->close();
//
//     if ($affected > 0) {
//         echo json_encode(["success" => true, "mensaje" => "Te has retirado del curso exitosamente."]);
//     } else {
//         echo json_encode(["success" => false, "error" => "No se encontró la inscripción."]);
//     }
//     exit();
// } catch (Exception $e) {
//     echo json_encode(["success" => false, "error" => "Excepción: " . $e->getMessage()]);
//     error_log("retirarseCurso.php error: " . $e->getMessage());
//     exit();
// }

//  Nuevo comportamiento: simulación sin tocar la base de datos
sleep(1); // pequeña pausa para simular proceso
echo json_encode([
    "success" => true,
    "mensaje" => "Te has retirado visualmente del curso ."
]);
exit();
?>