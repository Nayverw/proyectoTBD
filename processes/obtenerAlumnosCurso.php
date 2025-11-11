<?php
header('Content-Type: application/json; charset=utf-8');
include_once('../conexion.php');

if (!isset($_GET['id_curso'])) {
    echo json_encode(["success" => false, "error" => "Falta id_curso"]);
    exit();
}

$id_curso = intval($_GET['id_curso']);

try {
    // Relación: INSCRIPCION → ROL_USUARIO → USUARIO
    $sql = "
        SELECT 
            u.nombres, 
            u.apellidos, 
            u.correo
        FROM INSCRIPCION i
        JOIN ROL_USUARIO ru ON i.id_rol_usuario = ru.id_rol_usuario
        JOIN USUARIO u ON ru.id_usuario = u.id_usuario
        WHERE i.id_curso = ?
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_curso);
    $stmt->execute();
    $result = $stmt->get_result();

    $alumnos = [];
    while ($row = $result->fetch_assoc()) {
        $alumnos[] = [
            "nombre" => $row["nombres"] . " " . $row["apellidos"],
            "correo" => $row["correo"]
        ];
    }

    $stmt->close();
    $conn->close();

    echo json_encode(["success" => true, "alumnos" => $alumnos]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>