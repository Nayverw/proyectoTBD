<?php
header('Content-Type: application/json');
include("../conexion.php");

// 🔹 Obtener datos del formulario (enviados por JS)
$id_curso = intval($_POST['id_curso'] ?? 0);
$id_rol_usuario = intval($_POST['id_rol_usuario'] ?? 0);

if (!$id_curso || !$id_rol_usuario) {
    echo json_encode(["success" => false, "mensaje" => "Datos incompletos."]);
    exit();
}

// 🔹 Verificar si ya está inscrito
$sqlCheck = "SELECT * FROM inscripcion WHERE id_curso = ? AND id_rol_usuario = ?";
$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("ii", $id_curso, $id_rol_usuario);
$stmtCheck->execute();
$result = $stmtCheck->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "mensaje" => "Ya estás inscrito en este curso."]);
    exit();
}
$stmtCheck->close();

// 🔹 Datos obligatorios para insertar
$fecha_inscripcion = date("Y-m-d H:i:s");
$fecha_finalizacion = null;
$costo = 0; // Puedes ajustarlo más adelante según curso
$modalidad = "Online"; // Valor por defecto
$progreso = 0;
$estado = "Activo";

// 🔹 Insertar en la tabla INSCRIPCION
$sqlInsert = "
    INSERT INTO inscripcion 
    (fecha_inscripcion, fecha_finalizacion, costo, modalidad, progreso, estado, id_curso, id_rol_usuario)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
";
$stmt = $conn->prepare($sqlInsert);
$stmt->bind_param(
    "ssidsdii",
    $fecha_inscripcion,
    $fecha_finalizacion,
    $costo,
    $modalidad,
    $progreso,
    $estado,
    $id_curso,
    $id_rol_usuario
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "mensaje" => "✅ Inscripción exitosa al curso."]);
} else {
    echo json_encode(["success" => false, "mensaje" => "❌ Error al inscribirse: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
