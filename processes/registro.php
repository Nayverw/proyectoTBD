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

$nombres = trim($_POST['Nombre'] ?? '');
$apellidos = trim($_POST['Apellido'] ?? '');
$correo = trim($_POST['email'] ?? '');
$contrasenia = $_POST['contrasenia'] ?? '';
$fecha_nacimiento = $_POST['fecha'] ?? '';
$telefono = trim($_POST['telefono'] ?? '');
$rol_nombre = $_POST['rol'] ?? 'Estudiante';
$codigo_invitacion = trim($_POST['codigo_invitacion'] ?? '');

// Verificar si ya existe un administrador
$sql_admin = "SELECT COUNT(*) AS total FROM login l
              INNER JOIN rol_usuario ru ON l.id_rol_usuario = ru.id_rol_usuario
              WHERE ru.id_rol = 3"; // 3 = Administrador
$result_admin = $conn->query($sql_admin);
$row_admin = $result_admin->fetch_assoc();
$adminExistente = $row_admin['total'] > 0;

if (!empty($_POST)) {
    if (!$nombres || !$apellidos || !$correo || !$contrasenia || !$fecha_nacimiento || !$telefono) {
        die("Todos los campos obligatorios deben completarse.");
    }

    // ⚠️ Validación para ADMINISTRADOR
    if ($rol_nombre === "Administrador" && $adminExistente) {
        die("Ya existe un administrador registrado. No se puede registrar otro.");
    }

    $conn->begin_transaction();

    try {
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

        $stmt = $conn->prepare("INSERT INTO LOGIN (contrasenia, codigo, correo_institucional, id_rol_usuario) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $contrasenia_plana, $codigo_random, $correo_institucional, $id_rol_usuario);
        $stmt->execute();
        $stmt->close();

        $stmt_check = $conn->prepare("SELECT COUNT(*) AS cnt FROM GESTION_PUNTOS WHERE id_rol_usuario = ?");
        $stmt_check->bind_param("i", $id_rol_usuario);
        $stmt_check->execute();
        $res_check = $stmt_check->get_result()->fetch_assoc();
        $stmt_check->close();

        if (intval($res_check['cnt']) === 0) {
            $stmt = $conn->prepare("INSERT INTO GESTION_PUNTOS (total_puntos_acumulados, total_puntos_gastados, total_puntos_actuales, id_rol_usuario) VALUES (0, 0, 0, ?)");
            $stmt->bind_param("i", $id_rol_usuario);
            $stmt->execute();
            $stmt->close();
        }

        $conn->commit();
        header('Location: ../index.html');
        exit;

    } catch (Exception $e) {
        $conn->rollback();
        die("Error al crear usuario: " . $e->getMessage());
    }
}
?>
