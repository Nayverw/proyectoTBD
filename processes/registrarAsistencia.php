<?php
header('Content-Type: application/json');

// Conexión
//require_once __DIR__ . "/../conexion.php";
require_once "../conexion.php"; // Conexión MySQLI ($conn)

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

// Recibir datos
$id_curso = isset($_POST['id_curso']) ? intval($_POST['id_curso']) : 0;

// Puede venir como JSON o como un solo id individual
$asistentes = [];
if (isset($_POST['asistentes'])) {
    $asistentes = json_decode($_POST['asistentes'], true);
} elseif (isset($_POST['id_rol_usuario'])) {
    $asistentes = [ intval($_POST['id_rol_usuario']) ];
}

if (!$id_curso || empty($asistentes)) {
    echo json_encode(['success' => false, 'error' => 'Faltan parámetros']);
    exit;
}

// Obtener id_horario del curso (puede ser null)
$id_horario = null;
$res = $conn->query("SELECT id_horario FROM horario WHERE id_curso = $id_curso LIMIT 1");
if ($res && $res->num_rows > 0) {
    $row = $res->fetch_assoc();
    $id_horario = $row['id_horario'];
}

$fecha_hoy = date('Y-m-d');
$fecha_hora = date('Y-m-d H:i:s');

$errores = [];
$ya_registrados = [];

// Preparar inserción
$stmt = $conn->prepare("INSERT INTO asistencia (fecha_asistencia, fecha_asistida, id_horario, id_curso, id_rol_usuario) VALUES (?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Error en la preparación de la consulta: ' . $conn->error]);
    exit;
}

foreach ($asistentes as $id_usuario) {
    $id_usuario = intval($id_usuario);

    // Verificar si ya tiene asistencia hoy para este curso
    $check = $conn->prepare("SELECT id_asistencia FROM asistencia WHERE id_rol_usuario = ? AND id_curso = ? AND DATE(fecha_asistencia) = ?");
    $check->bind_param("iis", $id_usuario, $id_curso, $fecha_hoy);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        $ya_registrados[] = $id_usuario;
        $check->close();
        continue; // saltar a siguiente alumno
    }
    $check->close();

    // Insertar asistencia
    if ($id_horario === null) {
        $stmt_null = $conn->prepare("INSERT INTO asistencia (fecha_asistencia, fecha_asistida, id_horario, id_curso, id_rol_usuario) VALUES (?, ?, NULL, ?, ?)");
        if (!$stmt_null || !$stmt_null->bind_param("ssii", $fecha_hora, $fecha_hora, $id_curso, $id_usuario) || !$stmt_null->execute()) {
            $errores[] = $id_usuario;
        }
        $stmt_null->close();
    } else {
        if (!$stmt->bind_param("ssiii", $fecha_hora, $fecha_hora, $id_horario, $id_curso, $id_usuario) || !$stmt->execute()) {
            $errores[] = $id_usuario;
        }
    }
}

$stmt->close();

if (!empty($ya_registrados) && empty($errores)) {
    echo json_encode(['success' => false, 'error' => 'Ya se registró asistencia hoy para los siguientes usuarios: ' . implode(", ", $ya_registrados)]);
} elseif (!empty($errores)) {
    echo json_encode(['success' => false, 'error' => 'Error al registrar asistencia para usuarios: ' . implode(", ", $errores)]);
} else {
    echo json_encode(['success' => true, 'mensaje' => 'Asistencia registrada correctamente']);
}
?>
