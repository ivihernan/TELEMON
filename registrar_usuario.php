<?php 
header("Content-Type: application/json; charset=UTF-8");

require_once "conexion.php";

$input = file_get_contents("php://input");
$datos = json_decode($input, true);

if (!$datos || empty($datos['email']) || empty($datos['password']) || empty($datos['username']) || empty($datos['ciudad']) || empty($datos['fecha_nacimiento'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "mensaje" => "Todos los campos son obligatorios."]);
    exit();
}

//Compruebo la edad
try{
  $fechaNacimiento = new DateTime($datos['fecha_nacimiento']);
  $hoy = new DateTime();
  $edad = $hoy->diff($fechaNacimiento)->y;

  if($edad < 18){
    http_response_code(400);
    echo json_encode(["status" => "error", "mensaje" => "Debes ser mayor de edad para crearte la cuenta."]);
    exit();
  }
}catch(Exception $e){
  http_response_code(400);
  echo json_encode(["status" => "error", "mensaje" => "Formato de fecha no valida."]);
  exit();
}

//En el ccaso que si sea mayor de edad
try {
    $passwordHash = password_hash($datos['password'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (nombre, email, password, ciudad, fecha_nacimiento) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $datos['username'],
        $datos['email'],
        $passwordHash,
        $datos['ciudad'],
        $datos['fecha_nacimiento']
    ]);

    echo json_encode(["status" => "ok", "mensaje" => "Cuenta creada correctamente."]);

} catch (PDOException $e) {
    http_response_code(500);
    if ($e->getCode() == 23000) {
        echo json_encode(["status" => "error", "mensaje" => "El correo electrónico ya está registrado."]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error en la BD: " . $e->getMessage()]);
    }
}
?>