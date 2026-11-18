<?php
session_start();
header("Content-Type: application/json; charset=UTF-8");
require_once("conexion.php");

// 1. Verificar que hay sesión activa
if (!isset($_SESSION["usuario"]["id"])) {
  http_response_code(401);
  echo json_encode(["status" => "error", "mensaje" => "Debes iniciar sesión para comprar."]);
  mysqli_close($db);
  exit;
}

$input = file_get_contents("php://input");
$datos = json_decode($input, true);
$items = $datos["items"] ?? [];

if (empty($items) || !is_array($items)) {
  http_response_code(400);
  echo json_encode(["status" => "error", "mensaje" => "El carrito está vacío."]);
  mysqli_close($db);
  exit;
}

$usuarioId = intval($_SESSION["usuario"]["id"]);

// 2. Calcular el coste total en el servidor
$totalCompra = 0;
foreach ($items as $item) {
  $precio = floatval($item["price"] ?? 0);
  $cantidad = intval($item["cantidad"] ?? 1);
  if ($cantidad > 0 && $precio >= 0) {
    $totalCompra += ($precio * $cantidad);
  }
}

// 3. Comprobar el saldo real del usuario en la BD
$stmtSaldo = mysqli_prepare($db, "SELECT saldo FROM usuarios WHERE id = ?");
mysqli_stmt_bind_param($stmtSaldo, "i", $usuarioId);
mysqli_stmt_execute($stmtSaldo);
$resSaldo = mysqli_stmt_get_result($stmtSaldo);
$filaUsuario = mysqli_fetch_assoc($resSaldo);
mysqli_stmt_close($stmtSaldo);

$saldoActual = floatval($filaUsuario["saldo"] ?? 0);

if ($saldoActual < $totalCompra) {
  http_response_code(400);
  echo json_encode(["status" => "error", "mensaje" => "No tienes suficiente saldo en la cartera."]);
  mysqli_close($db);
  exit;
}

// 4. Transacción: restar saldo y guardar/sumar cartas en inventario
mysqli_begin_transaction($db);

$nuevoSaldo = $saldoActual - $totalCompra;
$stmtUpdateSaldo = mysqli_prepare($db, "UPDATE usuarios SET saldo = ? WHERE id = ?");
mysqli_stmt_bind_param($stmtUpdateSaldo, "di", $nuevoSaldo, $usuarioId);
$okSaldo = mysqli_stmt_execute($stmtUpdateSaldo);
mysqli_stmt_close($stmtUpdateSaldo);

$stmtInv = mysqli_prepare($db, "INSERT INTO inventario (usuario_id, carta_id, cantidad) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)");
$okInv = true;

foreach ($items as $item) {
  $cartaId = $item["id"] ?? "";
  $cantidad = intval($item["cantidad"] ?? 1);
  if (empty($cartaId) || $cantidad <= 0) continue;

  mysqli_stmt_bind_param($stmtInv, "isi", $usuarioId, $cartaId, $cantidad);
  if (!mysqli_stmt_execute($stmtInv)) {
    $okInv = false;
    break;
  }
}
mysqli_stmt_close($stmtInv);

if ($okSaldo && $okInv) {
  mysqli_commit($db);
  // Actualizamos también el saldo en $_SESSION para que al recargar F5 se mantenga
  $_SESSION["usuario"]["saldo"] = $nuevoSaldo;

  echo json_encode([
    "status" => "ok",
    "mensaje" => "¡Compra realizada con éxito!",
    "nuevoSaldo" => $nuevoSaldo
  ]);
} else {
  mysqli_rollback($db);
  http_response_code(500);
  echo json_encode(["status" => "error", "mensaje" => "Error al procesar la compra en la base de datos."]);
}

mysqli_close($db);
