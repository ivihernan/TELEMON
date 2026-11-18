<?php
$host = "localhost";
$usuario = "root";
$password = "";
$database = "mi_proyecto";


// try {
//   $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $usuario, $password);

//   $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
// }catch(PDOException $e){
//   http_response_code(500);
//   echo json_encode(["status" => "error", "mensajes" => "Error de conexion: " . $e->getMessage()]);
//   exit();
// }

mysqli_report(MYSQLI_REPORT_OFF);

@$db = mysqli_connect($host, $usuario, $password, $database);
if (!$db) {
  //Si fallamos en la conexion devuelvo un json de error
  header("Content-Type: application/json; charset=UTF-8");
  http_response_code(500);
  echo json_encode([
    "status" => "error",
    "mensaje" => "Error de conexión (" . mysqli_connect_errno() . "): " . mysqli_connect_error()
  ]);
  exit;
}
mysqli_set_charset($db, "utf8mb4");
