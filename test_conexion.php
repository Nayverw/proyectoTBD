<?php
require_once "conexion.php"; // Asegúrate que el nombre coincide exactamente

if ($conn) {
    echo "<h2>✅ Conexión exitosa a la base de datos.</h2>";
} else {
    echo "<h2>❌ Error de conexión.</h2>";
}
?>
