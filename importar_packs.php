<?php
require_once("conexion.php");

$jsonPath = "data/packs.json";

if (!file_exists($jsonPath)) {
  die("❌ Error: No se encuentra el archivo en '{$jsonPath}'. Comprueba la ruta.");
}

$jsonContent = file_get_contents($jsonPath);
$setsData = json_decode($jsonContent, true);

if (!$setsData || !is_array($setsData)) {
  die("❌ Error al decodificar el JSON de packs.");
}

// Iniciamos transacción procedimental
mysqli_begin_transaction($db);

$stmtSet = mysqli_prepare($db, "REPLACE INTO sets (id, nombre, serie, fecha_lanzamiento, total_cartas, precio_sobre, logo_url, simbolo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmtCarta = mysqli_prepare($db, "REPLACE INTO cartas (id, set_id, nombre, rareza, precio_base, imagen_url, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)");

if (!$stmtSet || !$stmtCarta) {
  mysqli_rollback($db);
  die("❌ Error preparando consultas: " . mysqli_error($db));
}

$totalSets = 0;
$totalCartas = 0;
$todoOk = true;

foreach ($setsData as $set) {
  $setId = $set['setId'] ?? $set['id'] ?? '';
  $setName = $set['setName'] ?? $set['name'] ?? '';
  $series = $set['series'] ?? '';
  $releaseDate = $set['releaseDate'] ?? '';
  $totalCards = intval($set['totalCards'] ?? $set['total_cards'] ?? 0);
  $price = floatval($set['price'] ?? $set['packPrice'] ?? 0);
  $logo = $set['logo'] ?? '';
  $symbol = $set['symbol'] ?? '';

  if (empty($setId)) continue;

  // Tipos: s=string, i=integer, d=double -> "ssssidss"
  mysqli_stmt_bind_param($stmtSet, "ssssidss", $setId, $setName, $series, $releaseDate, $totalCards, $price, $logo, $symbol);

  if (!mysqli_stmt_execute($stmtSet)) {
    $todoOk = false;
    break;
  }
  $totalSets++;

  $cards = $set['cards'] ?? [];
  if (is_array($cards)) {
    foreach ($cards as $card) {
      $cardId = $card['id'] ?? '';
      $cardName = $card['name'] ?? '';
      $rarity = $card['rarity'] ?? 'Common';
      $basePrice = floatval($card['basePrice'] ?? $card['price'] ?? 0);
      $image = $card['image'] ?? '';

      $type = 'Incoloro';
      if (isset($card['type']) && is_string($card['type'])) {
        $type = $card['type'];
      } elseif (isset($card['types']) && is_array($card['types']) && count($card['types']) > 0) {
        $type = $card['types'][0];
      }

      if (empty($cardId)) continue;

      // Tipos: "ssssdss"
      mysqli_stmt_bind_param($stmtCarta, "ssssdss", $cardId, $setId, $cardName, $rarity, $basePrice, $image, $type);

      if (!mysqli_stmt_execute($stmtCarta)) {
        $todoOk = false;
        break 2;
      }
      $totalCartas++;
    }
  }
}

if ($todoOk) {
  mysqli_commit($db);
  echo "<h2>✅ ¡Importación completada con éxito!</h2>";
  echo "<p>Se han importado <strong>{$totalSets}</strong> expansiones y <strong>{$totalCartas}</strong> cartas a MySQL.</p>";
} else {
  mysqli_rollback($db);
  echo "❌ Error durante la importación: " . mysqli_error($db);
}

mysqli_stmt_close($stmtSet);
mysqli_stmt_close($stmtCarta);
mysqli_close($db);
