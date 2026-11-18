<?php
header("Content-Type: application/json; charset=UTF-8");
require_once("conexion.php");

//Obtengo los sets 
$sqlSets = "SELECT id AS setId, nombre AS setName, serie AS series, precio_sobre AS packPrice, logo_url AS logo, simbolo_url AS symbol FROM sets";
$resSets = mysqli_query($db, $sqlSets);

if (!$resSets) {
  http_response_code(500);
  echo json_encode(["status" => "error", "mensaje" => "Error al obtener sets: " . mysqli_error($db)]);
  mysqli_close($db);
  exit();
}

$sets = [];

$sqlCartas = "SELECT id, nombre AS name, rareza AS rarity, precio_base AS basePrice, imagen_url AS image, tipo AS type FROM cartas WHERE set_id = ?";
$stmtCartas = mysqli_prepare($db, $sqlCartas);

//recorro cada set y hago la peticion al servidor para recoger cada carta
while ($set = mysqli_fetch_assoc($resSets)) {
  $set['packPrice'] = floatval($set['packPrice']);
  $set['cards'] = [];

  if ($stmtCartas) {
    mysqli_stmt_bind_param($stmtCartas, "s", $set['setId']);
    mysqli_stmt_execute($stmtCartas);
    $resCartas = mysqli_stmt_get_result($stmtCartas);
    while ($carta = mysqli_fetch_assoc($resCartas)) {
      $carta['basePrice'] = floatval($carta['basePrice']);
      $set['cards'][] = $carta;
    }
  }

  $sets[] = $set;
}

if ($stmtCartas) {
  mysqli_stmt_close($stmtCartas);
}

mysqli_close($db);
echo json_encode($sets);
