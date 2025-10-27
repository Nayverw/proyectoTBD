<?php
require_once("../conexion.php");

function generarCodigo($longitud = 8) {
    $caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $codigo = '';
    for ($i = 0; $i < $longitud; $i++) {
        $codigo .= $caracteres[rand(0, strlen($caracteres) - 1)];
    }
    return $codigo;
}

$nombres          = trim($_POST['Nombre'] ?? '');
$apellidos        = trim($_POST['Apellido'] ?? '');
$correo           = trim($_POST['email'] ?? '');
$contrasenia      = $_POST['contrasenia'] ?? '';
$fecha_nacimiento = $_POST['fecha'] ?? '';
$telefono         = trim($_POST['telefono'] ?? '');
$rol_nombre       = $_POST['rol'] ?? 'Estudiante';
$codigo_invitacion= trim($_POST['codigo_invitacion'] ?? '');

if (!empty($_POST)) {
    if (!$nombres || !$apellidos || !$correo || !$contrasenia || !$fecha_nacimiento || !$telefono) {
        die("Todos los campos obligatorios deben completarse.");
    }

    if (strtolower($rol_nombre) === "docente") {
        if (empty($codigo_invitacion)) die("Debes ingresar un código de invitación para registrarte como docente.");

        $stmt = $conn->prepare("SELECT * FROM codigos_docente WHERE codigo = ? AND usado = 0");
        $stmt->bind_param("s", $codigo_invitacion);
        $stmt->execute();
        $resultado = $stmt->get_result();
        if ($resultado->num_rows === 0) die("Código de invitación inválido o ya usado.");
        $stmt->close();
    }

    // 🔹 GUARDAR CONTRASEÑA EN TEXTO PLANO (SIN ENCRIPTAR)
    $contrasenia_plana = $contrasenia;

    $ci = rand(10000000, 99999999);
    $estado = "Activo";

    $stmt = $conn->prepare("INSERT INTO USUARIO (nombres, apellidos, fecha_nacimiento, ci, telefono, correo, estado) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssiss", $nombres, $apellidos, $fecha_nacimiento, $ci, $telefono, $correo, $estado);
    $stmt->execute();
    $id_usuario = $stmt->insert_id;
    $stmt->close();

    $stmt_rol = $conn->prepare("SELECT id_rol FROM ROL WHERE nombre = ?");
    $stmt_rol->bind_param("s", $rol_nombre);
    $stmt_rol->execute();
    $rol_data = $stmt_rol->get_result()->fetch_assoc();
    $id_rol = $rol_data['id_rol'];
    $stmt_rol->close();

    $stmt = $conn->prepare("INSERT INTO ROL_USUARIO (id_usuario, id_rol) VALUES (?, ?)");
    $stmt->bind_param("ii", $id_usuario, $id_rol);
    $stmt->execute();
    $id_rol_usuario = $stmt->insert_id;
    $stmt->close();

    $correo_institucional = htmlspecialchars(preg_replace('/@.+$/', '@classcloud.edu.bo', $correo));
    $codigo_random = generarCodigo(8);

    // 🔹 GUARDAR CONTRASEÑA TAL CUAL EN LOGIN
    $stmt = $conn->prepare("INSERT INTO LOGIN (contrasenia, codigo, correo_institucional, id_rol_usuario) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $contrasenia_plana, $codigo_random, $correo_institucional, $id_rol_usuario);
    $stmt->execute();
    $stmt->close();

    $stmt = $conn->prepare("INSERT INTO GESTION_PUNTOS (total_puntos_acumulados, total_puntos_gastados, total_puntos_actuales, id_rol_usuario) VALUES (0, 0, 0, ?)");
    $stmt->bind_param("i", $id_rol_usuario);
    $stmt->execute();
    $stmt->close();

    if (strtolower($rol_nombre) === "docente" && $codigo_invitacion) {
        $stmt_update = $conn->prepare("UPDATE codigos_docente SET usado = 1 WHERE codigo = ?");
        $stmt_update->bind_param("s", $codigo_invitacion);
        $stmt_update->execute();
        $stmt_update->close();
    }

    $conn->close();

    echo "
    <div style='position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: #1f0cce; color: #fff; padding: 15px 25px; border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-weight: 600; z-index: 1000;'>
        Usuario registrado correctamente. Redirigiendo...
    </div>
    <script>
        setTimeout(() => window.location.href='../index.html', 3000);
    </script>
    ";
}
?>
