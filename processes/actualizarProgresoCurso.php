<?php
// actualizarProgresoCurso.php
include("../conexion.php");

$id_inscripcion = $_POST['id_inscripcion'] ?? 0;
$id_modulo = $_POST['id_modulo'] ?? 0;

if(!$id_inscripcion || !$id_modulo){
    echo json_encode(["success"=>false,"error"=>"Datos incompletos"]);
    exit;
}

// Marcar módulo como completado
$conn->query("UPDATE progreso_modulo 
              SET estado='COMPLETADO', progreso=100 
              WHERE id_modulo=$id_modulo AND id_inscripcion=$id_inscripcion");

// Obtener id_curso
$res = $conn->query("SELECT id_curso FROM modulo WHERE id_modulo=$id_modulo");
$id_curso = $res->fetch_assoc()['id_curso'] ?? 0;

// Contar módulos
$res = $conn->query("SELECT COUNT(*) AS total FROM modulo WHERE id_curso=$id_curso");
$total_modulos = $res->fetch_assoc()['total'] ?? 0;

// Contar módulos completados
$res = $conn->query("SELECT COUNT(*) AS completados 
                     FROM progreso_modulo pm
                     JOIN modulo m ON m.id_modulo=pm.id_modulo
                     WHERE pm.id_inscripcion=$id_inscripcion AND pm.estado='COMPLETADO' AND m.id_curso=$id_curso");
$completados = $res->fetch_assoc()['completados'] ?? 0;

// Calcular progreso en porcentaje
$progreso = intval(($completados / $total_modulos) * 100);

// Actualizar inscripción
$estado_curso = ($progreso==100) ? 'COMPLETADO' : 'EN CURSO';
$conn->query("UPDATE inscripcion SET progreso=$progreso, estado='$estado_curso' WHERE id_inscripcion=$id_inscripcion");

echo json_encode(["success"=>true,"progreso"=>$progreso,"estado"=>$estado_curso]);
