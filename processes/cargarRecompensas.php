<?php
header('Content-Type: application/json');
include("../conexion.php");

// Consulta todas las recompensas
$sql = "
    SELECT r.id_recompensa, r.nombre, r.precio_puntos, r.descuento, tr.nombre_tipo
    FROM RECOMPENSA r
    JOIN TIPO_RECOMPENSA tr ON r.id_tipo_recompensa = tr.id_tipo_recompensa
";

$result = $conn->query($sql);
$recompensas = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $recompensas[] = $row;
    }

    echo json_encode([
        "success" => true,
        "recompensas" => $recompensas
    ]);
} else {
    echo json_encode([
        "success" => false,
        "mensaje" => "No hay recompensas registradas"
    ]);
}

$conn->close();
?>
