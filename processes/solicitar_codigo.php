<?php
// Conexión a la base de datos
$host = "localhost";
$user = "root";
$pass = "";
$db   = "classcloud";
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Capturar datos del formulario
$nombre_completo = trim($_POST['nombre_completo']);
$estudios        = trim($_POST['estudios']);
$experiencia     = trim($_POST['experiencia']);
$motivo          = trim($_POST['motivo']);

// Generar código único
$codigo = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8)); // Ej: A3C9F1B2

// Insertar en la base de datos
$sql = "INSERT INTO Solicitud_codigo_docente (nombre_completo, estudios, experiencia_docente, motivo, codigo_generado)
        VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $nombre_completo, $estudios, $experiencia, $motivo, $codigo);

if ($stmt->execute()) {
    echo "<h2 style='text-align:center; margin-top:50px;'>✅ Solicitud enviada con éxito</h2>";
    echo "<p style='text-align:center;'>Tu código de invitación es: <strong>$codigo</strong></p>";
    echo "<p style='text-align:center;'><a href='registro.html'>Volver al registro</a></p>";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
