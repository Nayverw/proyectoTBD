<?php
header('Content-Type: application/json');
require_once "../conexion.php";

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$conn->set_charset("utf8");

try {

    // ===== Validar roles =====
    if (!isset($_GET['roles']) || trim($_GET['roles']) === '') {
        echo json_encode(["recompensas" => []]);
        exit;
    }

    $roles = explode(",", $_GET['roles']);

    // ===== Placeholders dinámicos =====
    $placeholders = implode(",", array_fill(0, count($roles), "?"));

    // ===== Límite solo estudiantes =====
    $limit = (count($roles) === 1 && $roles[0] === 'Estudiante') ? "LIMIT 5" : "";

    $sql = "
        SELECT 
            r.nombre AS nombre,
            COUNT(cr.id_recompensa) AS cantidad,
            r.precio_puntos AS precio,
            COUNT(cr.id_recompensa) * r.precio_puntos AS total_puntos
        FROM canje_recompensa cr
        JOIN recompensa r ON cr.id_tipo_recompensa = r.id_recompensa
        JOIN rol_usuario ru ON cr.id_rol_usuario = ru.id_rol_usuario
        JOIN rol ro ON ru.id_rol = ro.id_rol
        WHERE ro.nombre IN ($placeholders)
        GROUP BY r.id_recompensa
        ORDER BY cantidad DESC
        $limit
    ";

    $stmt = $conn->prepare($sql);

    // ===== Bind dinámico =====
    $types = str_repeat("s", count($roles));
    $stmt->bind_param($types, ...$roles);

    $stmt->execute();
    $result = $stmt->get_result();

    $recompensas = [];

    while ($fila = $result->fetch_assoc()) {
        $recompensas[] = $fila;
    }

    echo json_encode([
        "recompensas" => $recompensas
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "mensaje" => $e->getMessage()
    ]);
}