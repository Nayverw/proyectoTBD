<?php
require_once("../conexion.php");
header("Content-Type: application/json");

$idRecompensa = intval($_POST["id_recompensa"] ?? 0);
$idRolUsuario = intval($_POST["id_rol_usuario"] ?? 0);

if ($idRecompensa === 0 || $idRolUsuario === 0) {
    echo json_encode(["estado" => "error", "msg" => "Datos inválidos"]);
    exit;
}

// 1. Obtener información completa de la recompensa
$sql = $conn->prepare("SELECT nombre, precio_puntos, id_tipo_recompensa FROM RECOMPENSA WHERE id_recompensa = ?");
$sql->bind_param("i", $idRecompensa);
$sql->execute();
$result = $sql->get_result();
$recompensa = $result->fetch_assoc();

if (!$recompensa) {
    echo json_encode(["estado" => "error", "msg" => "Recompensa no encontrada"]);
    exit;
}

$nombreRecompensa = $recompensa["nombre"];
$precio = intval($recompensa["precio_puntos"]);
$idTipoRecompensa = intval($recompensa["id_tipo_recompensa"]);

// 2. Obtener puntos del usuario
$sql2 = $conn->prepare("SELECT total_puntos_actuales, total_puntos_gastados FROM GESTION_PUNTOS WHERE id_rol_usuario = ?");
$sql2->bind_param("i", $idRolUsuario);
$sql2->execute();
$resPuntos = $sql2->get_result();
$puntos = $resPuntos->fetch_assoc();

if (!$puntos) {
    echo json_encode(["estado" => "error", "msg" => "No existe registro de puntos"]);
    exit;
}

$actuales = intval($puntos["total_puntos_actuales"]);
$gastados = intval($puntos["total_puntos_gastados"]);

// Si no tiene puntos suficientes
if ($actuales < $precio) {
    echo json_encode(["estado" => "insuficientes"]);
    exit;
}

// 3. Registrar canje en CANJE_RECOMPENSA
$sql3 = $conn->prepare(
    "INSERT INTO CANJE_RECOMPENSA (id_recompensa, usado, fecha_usado, id_tipo_recompensa, id_rol_usuario)
     VALUES (?, 'Si', NOW(), ?, ?)"
);
$sql3->bind_param("iii", $idRecompensa, $idTipoRecompensa, $idRolUsuario);

if(!$sql3->execute()){
    echo json_encode(["estado"=>"error","msg"=>"Error insertando canje"]);
    exit;
}

// 4. Actualizar puntos
$nuevosActuales = $actuales - $precio;
$nuevosGastados = $gastados + $precio;

$sql4 = $conn->prepare("UPDATE GESTION_PUNTOS SET total_puntos_actuales = ?, total_puntos_gastados = ? WHERE id_rol_usuario = ?");
$sql4->bind_param("iii", $nuevosActuales, $nuevosGastados, $idRolUsuario);
$sql4->execute();

// 5. Registrar BITÁCORA (CORREGIDO CON FECHA)
$accion = "CANJEAR_RECOMPENSA";
$descripcion = "El usuario con ID_ROL_USUARIO $idRolUsuario canjeó la recompensa '$nombreRecompensa' (ID $idRecompensa) por $precio puntos.";
$tabla = "CANJE_RECOMPENSA";

$sqlBit = $conn->prepare(
    "INSERT INTO BITACORA (accion, descripcion, tabla_afectada, id_rol_usuario, fecha)
     VALUES (?, ?, ?, ?, NOW())"
);
$sqlBit->bind_param("sssi", $accion, $descripcion, $tabla, $idRolUsuario);
$sqlBit->execute();

echo json_encode(["estado"=>"ok"]);
exit;
?>
