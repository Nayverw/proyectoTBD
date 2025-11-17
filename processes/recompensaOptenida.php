<?php
require_once("../conexion.php");
header("Content-Type: application/json");

$idRecompensa = intval($_POST["id_recompensa"] ?? 0);
$idRolUsuario = intval($_POST["id_rol_usuario"] ?? 0);

if ($idRecompensa === 0 || $idRolUsuario === 0) {
    echo json_encode(["estado" => "error", "msg" => "Datos inválidos"]);
    exit;
}

// 1. Obtener precio y tipo de la recompensa
$sql = $conn->prepare("SELECT precio_puntos FROM RECOMPENSA WHERE id_recompensa = ?");
$sql->bind_param("i", $idRecompensa);
$sql->execute();
$result = $sql->get_result();
$recompensa = $result->fetch_assoc();

if (!$recompensa) {
    echo json_encode(["estado" => "error", "msg" => "Recompensa no encontrada"]);
    exit;
}

$precio = intval($recompensa["precio_puntos"]);

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

if ($actuales < $precio) {
    echo json_encode(["estado" => "insuficientes"]);
    exit;
}

// 3. Registrar canje
$sql3 = $conn->prepare(
    "INSERT INTO CANJE_RECOMPENSA (usado, fecha_usado, id_tipo_recompensa, id_rol_usuario)
     VALUES ('No', NULL, ?, ?)"
);
$sql3->bind_param("ii", $idRecompensa, $idRolUsuario);

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

echo json_encode(["estado"=>"ok"]);
exit;
?>