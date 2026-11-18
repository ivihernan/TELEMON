<?php

session_start();
require_once("conexion.php");

$username = trim($_POST["username"] ?? '');
$email = trim($_POST["email"] ?? '');
$password = trim($_POST["password"] ?? '');
$ciudad = trim($_POST["ciudad"] ?? '');
$fecha_nacimiento = trim($_POST["fecha_nacimiento"] ?? '');

if (empty($username) || empty($email) || empty($password) || empty($ciudad) || empty($fecha_nacimiento)) {
  echo "<script>alert('Faltan campos sin rellenar. Porfavor completelos'); history.back();</script>";
  exit();
}

//Tengo que validar que es +18
$fechaNacimientoObjetivo = date_create($fecha_nacimiento); //Para poder poner la fecha en el fomato aaaa-mm-dd
$hoy = date_create();
if (!$fechaNacimientoObjetivo || date_diff($fechaNacimientoObjetivo, $hoy)->y < 18) { //Al poner solo la y me quedo solo con los a;os commpletados
  echo "<script>alert('Lo sentimos, no puedes acceder a la pagina web siendo menor'); history.back();</script>";
  exit();
}

//Hago el hash de la password y lo meto todo en la base de datos
$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$saldo = 100.00;
$creado = date("Y-m-d H:i:s");
$query = "INSERT INTO usuarios (nombre, email, password, ciudad, fecha_nacimiento, saldo, creado) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = mysqli_prepare($db, $query);


if ($stmt) {
  mysqli_stmt_bind_param($stmt, "sssssds", $username, $email, $passwordHash, $ciudad, $fecha_nacimiento, $saldo, $creado); //Las sss significan strings todas son strings
  if (mysqli_stmt_execute($stmt)) {
    //Hago uso de $_Session para guardar las sesiones
    $_SESSION["usuario"] = [
      "id" => mysqli_stmt_insert_id($stmt),
      "nombre" => $username,
      "email" => $email,
      "saldo" => $saldo
    ];
    mysqli_stmt_close($stmt);
    mysqli_close($db);
    //header("Location: index.php"); //Retorno al php de inicio
    //Pongo esto de momento para ver que si se crea el usuario, luego lo que hare es que no salga el alert y directamente te ponga el index.php con tu dinero
    echo "<script>
            alert('Cuenta creada exitosamente. Ha disfrutar de nuestras cartas!!');
            window.location.href = 'index.php';
          </script>
    ";
    exit();
  } else {
    echo "<script>alert('Correo ya en uso o hubo un error, pruebe otra vez'); history.back();</script>";
  }
  mysqli_stmt_close($stmt);
}
mysqli_close($db);
