<?php
session_start();
include('../conexion.php');

// 🔹 Obtener datos del formulario
$correo = isset($_POST['correo']) ? trim($_POST['correo']) : '';
$contrasena = isset($_POST['contrasena']) ? $_POST['contrasena'] : '';

if (empty($correo) || empty($contrasena)) {
    mostrarError("Campos vacíos", "Por favor completa todos los campos para iniciar sesión.");
    exit();
}

// 🔹 Consulta completa para obtener contraseña, rol y datos del usuario
$sql = "
SELECT 
    l.contrasenia,
    l.id_rol_usuario,
    u.nombres,
    u.apellidos,
    r.nombre AS rol
FROM login l
INNER JOIN rol_usuario ru ON l.id_rol_usuario = ru.id_rol_usuario
INNER JOIN usuario u ON ru.id_usuario = u.id_usuario
INNER JOIN rol r ON ru.id_rol = r.id_rol
WHERE l.correo_institucional = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $correo);
$stmt->execute();
$resultado = $stmt->get_result();

// 🔹 Verificar si existe el usuario
if ($resultado && $resultado->num_rows === 1) {
    $fila = $resultado->fetch_assoc();
    $contrasenia_guardada = $fila['contrasenia'];
    $id_rol_usuario = $fila['id_rol_usuario'];
    $nombre_completo = $fila['nombres'] . " " . $fila['apellidos'];
    $rol_nombre = strtoupper($fila['rol']); // ESTUDIANTE / DOCENTE

    if ($contrasena === $contrasenia_guardada) {

        // Guardar en sesión PHP si quieres
        $_SESSION['correo'] = $correo;
        $_SESSION['id_rol_usuario'] = $id_rol_usuario;

        // 🔹 Guardar datos en sessionStorage y redirigir
        echo "
        <script>
            sessionStorage.setItem('id_rol_usuario', '$id_rol_usuario');
            sessionStorage.setItem('correo', '$correo');
            sessionStorage.setItem('nombre_usuario', '$nombre_completo');
            sessionStorage.setItem('rol_usuario', '$rol_nombre'); // ESTUDIANTE o DOCENTE
            window.location.href = '../pages/inicio.html';
        </script>
        ";
        exit();
    } else {
        mostrarError("Usuario o contraseña incorrecta", "La contraseña ingresada no es válida.");
    }
} else {
    mostrarError("Usuario o contraseña incorrecta", "El correo ingresado no está registrado.");
}

$stmt->close();
$conn->close();


// 🔹 Función para mostrar errores
function mostrarError($titulo, $mensaje) {
    echo "
    <!DOCTYPE html>
    <html lang='es'>
    <head>
        <meta charset='UTF-8'>
        <title>Error de inicio de sesión</title>
        <style>
            body { font-family: Arial; background: #f2f2f2; display:flex; justify-content:center; align-items:center; height:100vh; }
            .card { background:white; padding:30px; border-radius:10px; text-align:center; }
            h2 { color:red; }
            button { padding:10px 20px; border:none; border-radius:5px; background:#0984e3; color:white; cursor:pointer; }
        </style>
    </head>
    <body>
        <div class='card'>
            <h2>$titulo</h2>
            <p>$mensaje</p>
            <a href='../index.html'><button>Volver</button></a>
        </div>
    </body>
    </html>
    ";
    exit();
}
?>
