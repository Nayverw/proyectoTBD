<?php
$host = "localhost";
$port = 3306;
$user = "root";
$pass = "";
$dbname = "classcloud";

$conn = new mysqli($host, $user, $pass, $dbname, $port);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>
