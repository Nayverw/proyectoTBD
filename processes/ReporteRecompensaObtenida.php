<?php
header('Content-Type: application/json');
require_once "../conexion.php";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$conn->set_charset("utf8");

try {
    if (!isset($_GET['roles']) || trim($_GET['roles']) === '') {
        echo json_encode(["usuarios" => []]);
        exit;
    }

    $roles = explode(",", $_GET['roles']);
    $fechaInicial = $_GET['fechaInicial'] ?? null;
    $fechaFinal = $_GET['fechaFinal'] ?? null;

    $placeholders = implode(",", array_fill(0, count($roles), "?"));
    $params = $roles;
    $types = str_repeat("s", count($roles));

    $filtroFecha = "";
    if ($fechaInicial && $fechaFinal) {
        $filtroFecha = " AND DATE(cr.fecha_usado) BETWEEN ? AND ?";
        $params[] = $fechaInicial;
        $params[] = $fechaFinal;
        $types .= "ss";
    }

    $sql = "
        SELECT 
            u.nombres,
            u.apellidos,
            ro.nombre AS tipo,
            COUNT(cr.id_recompensa) AS cantidad
        FROM canje_recompensa cr
        JOIN rol_usuario ru ON cr.id_rol_usuario = ru.id_rol_usuario
        JOIN usuario u ON ru.id_usuario = u.id_usuario
        JOIN rol ro ON ru.id_rol = ro.id_rol
        WHERE ro.nombre IN ($placeholders)
          AND cr.fecha_usado IS NOT NULL
          $filtroFecha
        GROUP BY u.id_usuario
        ORDER BY cantidad DESC
        LIMIT 5
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $usuarios = [];
    while ($fila = $result->fetch_assoc()) {
        $usuarios[] = $fila;
    }

    echo json_encode(["usuarios" => $usuarios]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "mensaje" => $e->getMessage()
    ]);
}