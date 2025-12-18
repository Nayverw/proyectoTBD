<?php
header('Content-Type: application/json');
require_once "../conexion.php";

$roles = [];

if (isset($_GET['roles'])) {
    $roles = explode(',', $_GET['roles']);
}

$filtroRol = "";
$params = [];

if (!empty($roles)) {
    $placeholders = implode(",", array_fill(0, count($roles), "?"));
    $filtroRol = " AND r.nombre IN ($placeholders)";
    $params = $roles;
}

$sql = "
    SELECT 
        u.nombres,
        u.apellidos,
        u.correo,
        gp.total_puntos_acumulados,
        gp.total_puntos_gastados,
        gp.total_puntos_actuales
    FROM USUARIO u
    INNER JOIN ROL_USUARIO ru ON ru.id_usuario = u.id_usuario
    INNER JOIN ROL r ON r.id_rol = ru.id_rol
    INNER JOIN GESTION_PUNTOS gp ON gp.id_rol_usuario = ru.id_rol_usuario
    WHERE 1=1 $filtroRol
";

$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $types = str_repeat("s", count($params));
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$usuarios = [];
$totAcumulados = 0;
$totGastados = 0;
$totActuales = 0;

while ($fila = $result->fetch_assoc()) {
    $usuarios[] = $fila;
    $totAcumulados += $fila['total_puntos_acumulados'];
    $totGastados += $fila['total_puntos_gastados'];
    $totActuales += $fila['total_puntos_actuales'];
}

echo json_encode([
    "fecha" => date("d/m/Y H:i"),
    "usuarios" => $usuarios,
    "totales" => [
        "acumulados" => $totAcumulados,
        "gastados" => $totGastados,
        "actuales" => $totActuales
    ]
]);