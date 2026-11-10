<?php 
header("Content-Type: application/json; charset=UTF-8");
require_once "conexion.php";

$input = file_get_contents("php://input");
$datos = json_decode($input, true);

if (!$datos || empty($datos['email']) || empty($datos['password'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "mensaje" => "Introduce el email y la contraseña."]);
    exit();
}

try{
  $sql = "SELECT id, nombre, email, password, ciudad, saldo FROM usuarios WHERE email = ?";

  $stmt = $pdo->prepare($sql);
  $stmt->execute([$datos['email']]);

  $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

  if($usuario && password_verify($datos['password'], $usuario['password'])){
    //Quito la contra de los datos que me devuelve el servidor
    unset($usuario['password']);

    echo json_encode([
      "status" => "ok",
      "mensaje" => "Welcome again " . $usuario['nombre'] . "!!!!", //Con el punto concateno frases
      "usuario" => $usuario
    ]);
  }else{
    http_response_code(401);
    echo json_encode(["status" => "error", "mensaje" => "Correo o contrase;as incorrectas, vuelva a intetarlo"]);
  }
}catch(PDOException $e){
  http_response_code(500);
  echo json_encode(["status" => "error", "mensaje" => "Error en la base de datos: " . $e->getMessage()]);
}

?>