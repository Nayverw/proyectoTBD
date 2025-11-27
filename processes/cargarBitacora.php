<?php
header('Content-Type: application/json');
include("../conexion.php");

// Obtener todo ordenado por fecha descendente
$sql = "SELECT id_bitacora, accion, descripcion, tabla_afectada, id_rol_usuario, fecha 
        FROM bitacora 
        ORDER BY fecha DESC";

$result = $conn->query($sql);

$registros = [];

while ($row = $result->fetch_assoc()) {
    $registros[] = [
        "id_bitacora" => $row["id_bitacora"],
        "accion" => $row["accion"],
        "descripcion" => $row["descripcion"],
        "tabla_afectada" => $row["tabla_afectada"],
        "id_rol_usuario" => $row["id_rol_usuario"],
        "fecha" => $row["fecha"]
    ];
}

echo json_encode([
    "success" => true,
    "registros" => $registros
]);

$conn->close();
?>
