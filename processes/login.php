<?php
session_start();
include('../conexion.php'); // Conexión a la BD

// 🔹 Obtener los datos del formulario
$correo = isset($_POST['correo']) ? trim($_POST['correo']) : '';
$contrasena = isset($_POST['contrasena']) ? $_POST['contrasena'] : '';

// 🔹 Validar campos vacíos
if (empty($correo) || empty($contrasena)) {
    mostrarError("Campos vacíos", "Por favor completa todos los campos para iniciar sesión.");
    exit();
}

// 🔹 Consulta a la tabla LOGIN
$sql = "SELECT contrasenia, id_rol_usuario FROM LOGIN WHERE correo_institucional = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $correo);
$stmt->execute();
$resultado = $stmt->get_result();

// 🔹 Verificar usuario existente
if ($resultado && $resultado->num_rows === 1) {
    $fila = $resultado->fetch_assoc();
    $contrasenia_guardada = $fila['contrasenia'];
    $id_rol_usuario = $fila['id_rol_usuario'];

    // 🔹 Comparar contraseñas (sin encriptar)
    if ($contrasena === $contrasenia_guardada) {
        // Guardar en sesión (opcional)
        $_SESSION['id_usuario'] = $id_usuario;
        $_SESSION['correo'] = $correo;
        $_SESSION['id_rol_usuario'] = $id_rol_usuario;

        // ✅ Redirigir a inicio.html enviando datos por URL
        header("Location: ../pages/inicio.html?correo=" . urlencode($correo) . "&id_rol_usuario=" . $id_rol_usuario);
        exit();
    } else {
        mostrarError("Usuario o contraseña incorrecta", "La contraseña ingresada no es válida.");
    }
} else {
    mostrarError("Usuario o contraseña incorrecta", "El correo ingresado no se encuentra registrado.");
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
            body { font-family: Arial, sans-serif; background: #f2f2f2; display:flex; justify-content:center; align-items:center; height:100vh; }
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