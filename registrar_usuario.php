<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "conexion.php";

// Leer datos (JSON o POST tradicional)
$input = file_get_contents("php://input");
$datos = json_decode($input, true);

if (!$datos) {
    $datos = $_POST;
}

// Extraer campos limpiando espacios
$email = trim($datos['email'] ?? '');
$password = trim($datos['password'] ?? '');
$username = trim($datos['username'] ?? '');
$ciudad = trim($datos['ciudad'] ?? '');
$fecha_nacimiento = trim($datos['fecha_nacimiento'] ?? '');

// Identificar exactamente si falta algún campo
$faltantes = [];
if (empty($email)) $faltantes[] = 'email';
if (empty($password)) $faltantes[] = 'password';
if (empty($username)) $faltantes[] = 'username';
if (empty($ciudad)) $faltantes[] = 'ciudad';
if (empty($fecha_nacimiento)) $faltantes[] = 'fecha_nacimiento';

if (!empty($faltantes)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "mensaje" => "Faltan los siguientes campos: " . implode(", ", $faltantes)
    ]);
    exit();
}

// Validar mayoría de edad (18 años)
try {
    $fechaNacObj = new DateTime($fecha_nacimiento);
    $hoy = new DateTime();
    $edad = $hoy->diff($fechaNacObj)->y;

    if ($edad < 18) {
        http_response_code(400);
        echo json_encode(["status" => "error", "mensaje" => "Debes ser mayor de 18 años para registrarte."]);
        exit();
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["status" => "error", "mensaje" => "La fecha de nacimiento no es válida."]);
    exit();
}

// Insertar en la Base de Datos
try {
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (nombre, email, password, ciudad, fecha_nacimiento) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$username, $email, $passwordHash, $ciudad, $fecha_nacimiento]);

    $idNuevoUsuario = $pdo->lastInsertId();

    $usuarioNuevo = [
        "id" => $idNuevoUsuario,
        "nombre" => $username,
        "email" => $email,
        "ciudad" => $ciudad,
        "fecha_nacimiento" => $fecha_nacimiento,
        "saldo" => 100.00
    ];

    echo json_encode(["status" => "ok", "mensaje" => "Cuenta creada correctamente.", "usuario" => $usuarioNuevo]);

} catch (PDOException $e) {
    http_response_code(500);
    if ($e->getCode() == 23000) {
        echo json_encode(["status" => "error", "mensaje" => "El correo electrónico ya está registrado."]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error en la BD: " . $e->getMessage()]);
    }
}
?>