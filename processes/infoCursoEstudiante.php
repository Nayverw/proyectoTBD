<?php
header("Content-Type: application/json; charset=utf-8");
ini_set('display_errors', 0); // No mostrar errores en JSON
error_reporting(E_ALL);

include_once("../conexion.php");

if (!isset($_GET['id_curso']) || empty($_GET['id_curso'])) {
    echo json_encode([
        "success" => false,
        "error" => "ID de curso no recibido"
    ]);
    exit;
}

$idCurso = intval($_GET['id_curso']);

$sqlCurso = "SELECT id_curso, nombre_curso, descripcion, modalidad, duracion, estado, cupo
             FROM curso WHERE id_curso = ?";
$stmtCurso = $conn->prepare($sqlCurso);
if (!$stmtCurso) {
    echo json_encode(["success"=>false, "error"=>"Error en prepare(): ".$conn->error]);
    exit;
}

$stmtCurso->bind_param("i", $idCurso);
$stmtCurso->execute();
$resultCurso = $stmtCurso->get_result();

if ($resultCurso->num_rows === 0) {
    echo json_encode(["success"=>false, "error"=>"Curso no encontrado"]);
    exit;
}

$curso = $resultCurso->fetch_assoc();

$sqlModulos = "SELECT id_modulo, nombre, valor_puntos FROM modulo WHERE id_curso = ? ORDER BY id_modulo ASC";
$stmtMod = $conn->prepare($sqlModulos);
if (!$stmtMod) {
    echo json_encode(["success"=>false, "error"=>"Error en prepare() modulos: ".$conn->error]);
    exit;
}

$stmtMod->bind_param("i", $idCurso);
$stmtMod->execute();
$resultMod = $stmtMod->get_result();

$modulos = [];
while ($row = $resultMod->fetch_assoc()) {
    $modulos[] = $row;
}

echo json_encode([
    "success"=>true,
    "curso"=>$curso,
    "modulos"=>$modulos
]);
