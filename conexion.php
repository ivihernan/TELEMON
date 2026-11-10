<?php 
$host = "localhost";
$usuario = "root";
$password = "";
$database = "mi_proyecto";


try {
  $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $usuario, $password);

  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}catch(PDOException $e){
  http_response_code(500);
  echo json_encode(["status" => "error", "mensajes" => "Error de conexion: " . $e->getMessage()]);
  exit();
}
?>