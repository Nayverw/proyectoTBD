<?php
require_once "../conexion.php";

$id = intval($_GET["id_rol_usuario"]);

// 1. Seminarios inscritos (CANJEADOS)
$sqlInscritos = $conn->query("
    SELECT id_seminario
    FROM CANJE_SEMINARIO
    WHERE id_rol_usuario = $id
");

$inscritos = [];
while ($row = $sqlInscritos->fetch_assoc()) {
    $inscritos[] = $row["id_seminario"];
}

$listaInscritos = count($inscritos) ? implode(",", $inscritos) : "0";

// 2. Cursos activos del usuario
$sqlCursos = $conn->query("
    SELECT id_curso
    FROM INSCRIPCION
    WHERE id_rol_usuario = $id
      AND estado = 'Activo'
");

$cursos = [];
while ($row = $sqlCursos->fetch_assoc()) {
    $cursos[] = $row["id_curso"];
}

if (!count($cursos)) {
    echo json_encode([]);
    exit;
}

$listaCursos = implode(",", $cursos);

// 3. Seminarios de esos cursos (NO inscritos)
$sqlSemNoIns = $conn->query("
    SELECT id_seminario, nombre
    FROM SEMINARIO
    WHERE id_curso IN ($listaCursos)
      AND id_seminario NOT IN ($listaInscritos)
");

$salida = [];
while ($row = $sqlSemNoIns->fetch_assoc()) {
    $salida[] = $row;
}

echo json_encode($salida);
?>