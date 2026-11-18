<?php
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}


require_once("conexion.php");


$username = trim($_POST["username"] ?? '');
$email = trim($_POST["email"] ?? '');
$password = trim($_POST["password"] ?? '');
$ciudad = trim($_POST["ciudad"] ?? '');
$fecha_nacimiento = trim($_POST["fecha_nacimiento"] ?? '');

if (empty($username) || empty($email) || empty($password) || empty($ciudad) || empty($fecha_nacimiento)) {
  echo "<script>alert('Campos vacios, porfavor rellenelos para completar el formulario'); history.back();</script>";
  exit();
}

$query = "INSERT INTO usuarios VALUES (NULL,?, ?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($db, $query);

$saldo = 100.00;
$creado = date("Y-m-d H:i:s");

$fecha_obj = new DateTime($fecha_nacimiento);
$creado_obj = new DateTime($creado);

$diferencia = $fecha_obj->diff($creado_obj);
echo "<script>console.log(`Han transcurrido $diferencia->y meses $diferencia->m y dias $diferencia->d`)</script>";

if ($diferencia->y < 18 || $diferencia->y >= 70) {
  echo "<script>alert('No puedes acceder a este sitio web siendo menor de edad o poniendo una fecha falsa. Lo sentimos'); history.back();</script>";
  exit();
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);


mysqli_stmt_bind_param($stmt, 'sssssds', $username, $email, $passwordHash, $ciudad, $fecha_nacimiento, $saldo, $creado);

$resultado = mysqli_stmt_execute($stmt);


$afectadas = mysqli_stmt_affected_rows($stmt);

if ($resultado) {
  $_SESSION['usuario'] = [
    "id" => mysqli_stmt_insert_id($stmt),
    "nombre" => $username,
    "email" => $email,
    "saldo" => $saldo,
  ];

  $usuario = json_encode($_SESSION["usuario"]);
  echo "<script>
          alert('Realizado con exito, bienvenido $username');
          window.location.href = 'index.php';
        </script>";
} else {
  echo "<script>alert(`Algo salio mal, pruebe a intentarlo de nuevos. $afectadas`); history.back(); </script>";
}

mysqli_stmt_close($stmt);
mysqli_close($db);
