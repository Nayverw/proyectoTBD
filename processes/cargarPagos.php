<?php
header('Content-Type: application/json');
include("../conexion.php");

$id_rol_usuario = intval($_GET['id_rol_usuario'] ?? 0);

if(!$id_rol_usuario){
    echo json_encode(["success"=>false,"mensaje"=>"ID de usuario no válido"]);
    exit();
}

$sql = "
SELECT p.id_pago, i.id_curso, p.monto_pagado, p.tipo_pago, p.fecha_pago,
       u.nombres, u.apellidos, c.id_curso, c.preciopuntos
FROM pago p
JOIN inscripcion i ON p.id_inscripcion = i.id_inscripcion
JOIN curso c ON i.id_curso = c.id_curso
JOIN rol_usuario ru ON c.id_docente = ru.id_rol_usuario
JOIN usuario u ON ru.id_usuario = u.id_usuario
WHERE i.id_rol_usuario = ?
ORDER BY p.fecha_pago DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i",$id_rol_usuario);
$stmt->execute();
$res = $stmt->get_result();

$pagos = [];
while($row=$res->fetch_assoc()){
    $pagos[]=[
        "id_pago"=>$row['id_pago'],
        "curso"=>"Curso ID: ".$row['id_curso'], // reemplaza si hay nombre
        "precio"=>$row['preciopuntos'],
        "docente"=>trim($row['nombres']." ".$row['apellidos']),
        "fecha_pago"=>$row['fecha_pago'],
        "monto_pagado"=>$row['monto_pagado'],
        "tipo_pago"=>$row['tipo_pago']
    ];
}

echo json_encode(["success"=>true,"pagos"=>$pagos]);
?>
