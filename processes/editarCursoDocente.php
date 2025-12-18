<?php
header('Content-Type: application/json; charset=utf-8');
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/../conexion.php';

try {
    // 📥 Recibir y validar datos
    $id_curso      = $_POST['id_curso'] ?? null;
    $id_tipo_curso = $_POST['id_tipo_curso'] ?? null;
    $id_docente    = $_POST['id_docente'] ?? null;
    $nombre_curso  = $_POST['nombre_curso'] ?? '';
    $curso_extra   = $_POST['curso_extra'] ?? 'NO'; // SI o NO
    $preciopuntos  = floatval($_POST['preciopuntos'] ?? 0);
    $duracion      = intval($_POST['duracion'] ?? 0);
    $cupo          = intval($_POST['cupo'] ?? 0);
    $estado        = $_POST['estado'] ?? 'ACTIVO';

    if (!$id_curso || !$id_tipo_curso || !$id_docente) {
        throw new Exception("Faltan datos obligatorios");
    }

    // 🔹 Convertir curso_extra a SI/NO
    $curso_extra = strtoupper($curso_extra);
    if ($curso_extra !== "SI") $curso_extra = "NO";

    // 🔹 Actualizar tipo_curso
    $stmt1 = $conn->prepare("UPDATE tipo_curso SET nombre_curso = ?, curso_extra = ? WHERE id_tipo_curso = ?");
    $stmt1->bind_param("ssi", $nombre_curso, $curso_extra, $id_tipo_curso);
    if (!$stmt1->execute()) {
        throw new Exception("Error al actualizar tipo_curso: " . $stmt1->error);
    }

    // 🔹 Actualizar curso (sin tocar aula ni horario)
    $stmt2 = $conn->prepare("
        UPDATE curso
        SET preciopuntos = ?, duracion = ?, cupo = ?, estado = ?
        WHERE id_curso = ? AND id_docente = ?
    ");
    $stmt2->bind_param(
        "ddisii",
        $preciopuntos,
        $duracion,
        $cupo,
        $estado,
        $id_curso,
        $id_docente
    );
    if (!$stmt2->execute()) {
        throw new Exception("Error al actualizar curso: " . $stmt2->error);
    }

    echo json_encode([
        "success" => true,
        "mensaje" => "Curso actualizado correctamente"
    ]);

} catch(Exception $e) {
    echo json_encode([
        "success" => false,
        "mensaje" => $e->getMessage()
    ]);
}
?>
