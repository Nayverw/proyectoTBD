<?php
require_once("../conexion.php");

$idRolUsuario = intval($_GET['id_rol_usuario'] ?? 0);

if ($idRolUsuario <= 0) {
    echo json_encode([]);
    exit;
}

// 1. Obtener el id_rol desde ROL_USUARIO
$sqlRol = "SELECT id_rol FROM ROL_USUARIO WHERE id_rol_usuario = ?";
$stmtRol = $conn->prepare($sqlRol);
$stmtRol->bind_param("i", $idRolUsuario);
$stmtRol->execute();
$resRol = $stmtRol->get_result();

if ($resRol->num_rows == 0) {
    echo json_encode([]);
    exit;
}

$filaRol = $resRol->fetch_assoc();
$idRol = intval($filaRol['id_rol']);

// 2. Traducir id_rol a cadena de rol
$rolFiltro = ($idRol == 1) ? "Estudiante" : (($idRol == 2) ? "Docente" : "");

// Si el rol no corresponde a ninguno de los dos, no mostrar nada
if ($rolFiltro == "") {
    echo json_encode([]);
    exit;
}

// 3. Obtener recompensas según rol, incluyendo id_tipo_recompensa
$sqlRecomp = "SELECT id_recompensa, nombre, precio_puntos, descuento, id_tipo_recompensa
              FROM RECOMPENSA 
              WHERE rol = ?";

$stmtRec = $conn->prepare($sqlRecomp);
$stmtRec->bind_param("s", $rolFiltro);
$stmtRec->execute();
$resRec = $stmtRec->get_result();

// 4. Convertir a arreglo para JSON
$recompensas = [];
while ($row = $resRec->fetch_assoc()) {
    $recompensas[] = $row;
}

// 5. Devolver JSON
echo json_encode($recompensas);
?>