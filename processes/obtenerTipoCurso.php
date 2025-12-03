<?php
header('Content-Type: application/json; charset=utf-8');
include_once('../conexion.php');

try {
    $res = $conn->query("SELECT id_tipo_curso, nombre_curso FROM tipo_curso ORDER BY nombre_curso");
    $tipos = [];
    while($row = $res->fetch_assoc()){
        $tipos[] = $row;
    }
    echo json_encode(["success"=>true, "tipos"=>$tipos]);
} catch(Exception $e){
    echo json_encode(["success"=>false, "error"=>$e->getMessage()]);
}
?>
