<?php
header("Content-Type: application/json; charset=UTF-8");

include('../conexion.php');

// ============================
// VALIDAR PARAMETRO "tipo"
// ============================
if (!isset($_GET['tipo'])) {
    echo json_encode([
        "error" => true,
        "mensaje" => "No se especificó el tipo de bitácora."
    ]);
    exit();
}

$tipo = intval($_GET['tipo']);

// ============================
// CONSULTA FILTRADA
// ============================
$sql = "
SELECT 
    id_bitacora,
    accion,
    descripcion,
    tabla_afectada,
    id_rol_usuario,
    fecha
FROM bitacora
WHERE id_tipo_bitacora = ?
ORDER BY fecha DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $tipo);
$stmt->execute();
$resultado = $stmt->get_result();

$bitacoras = [];

while ($fila = $resultado->fetch_assoc()) {
    $bitacoras[] = $fila;
}

$stmt->close();
$conn->close();

// ============================
// RESPUESTA JSON
// ============================
echo json_encode($bitacoras);
exit();

?>
