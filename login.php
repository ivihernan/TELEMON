<?php
session_start();
require_once("conexion.php");

$email = trim($_POST["email"] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
  echo "<script>alert('Rellena todos los campos para iniciar sesion porfavor'); history.back();</script>";
  exit();
}

//Hago la peticion que le voy a pedir a la base de daots
$query = "SELECT id, nombre, email, password, saldo FROM usuarios WHERE email = ?";
$stmt = mysqli_prepare($db, $query);

if ($stmt) {
  mysqli_stmt_bind_param($stmt, 's', $email);
  mysqli_stmt_execute($stmt);

  $resultado = mysqli_stmt_get_result($stmt);
  if ($usuario = mysqli_fetch_assoc($resultado)) {
    if (password_verify($password, $usuario['password'])) {
      //Guardo la sesion como antes en registrar
      $_SESSION['usuario'] = [
        'id' => $usuario['id'],
        'nombre' => $usuario['nombre'],
        'email' => $usuario['email'],
        'saldo' => $usuario['saldo']
      ];

      mysqli_stmt_close($stmt);
      mysqli_close($db);
      //header('Location: index.php');
      echo "<script>
            alert('Cuenta iniciada con exito. Ha gamblear como mas nos gusta!!');
            window.location.href = 'index.php';
          </script>
    ";
      exit();
    } else {
      echo "<script>alert('Algo no salio correctamente, pruebe otra vez'); history.back();</script>";
    }
  } else {
    echo "<script>alert('Algo no salio correctamente, pruebe otra vez'); history.back();</script>l";
  }
  mysqli_stmt_close($stmt);
}
mysqli_close($db);
