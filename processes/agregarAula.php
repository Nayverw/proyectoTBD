<?php
header('Content-Type: application/json');

try {
    // Recibir datos
    $nombre = $_POST['nombre'] ?? '';
    $ubicacion = $_POST['ubicacion'] ?? '';
    $descripcion = $_POST['descripcion'] ?? '';
    $disponible = $_POST['disponible'] ?? 1;

    // TODO: Validar y agregar a la base de datos
    // Ejemplo de conexión y query
    $conn = new mysqli("localhost", "root", "", "proyectoTBD");
    if ($conn->connect_error) throw new Exception("Error de conexión");

    $stmt = $conn->prepare("INSERT INTO aula (nombre, ubicacion, descripcion, disponible) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $nombre, $ubicacion, $descripcion, $disponible);

    if($stmt->execute()){
        echo json_encode(["success" => true, "mensaje" => "Aula creada correctamente"]);
    } else {
        echo json_encode(["success" => false, "error" => "No se pudo crear el aula"]);
    }

    $stmt->close();
    $conn->close();

} catch(Exception $e){
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
