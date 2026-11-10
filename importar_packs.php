<?php
require_once "conexion.php";

// Buscar el archivo JSON en la carpeta data/
$jsonPath = "data/packs.json";

if (!file_exists($jsonPath)) {
  die("❌ Error: No se encuentra el archivo en '{$jsonPath}'. Comprueba la ruta.");
}

$jsonContent = file_get_contents($jsonPath);
$setsData = json_decode($jsonContent, true);

if (!$setsData || !is_array($setsData)) {
  die("❌ Error al decodificar el JSON de packs.");
}

//Si quiero meter mas cartas y lo hago desde el packs.json tendria que volver a meter en la direccion de localhost/mi_proyecto/importar_packs.php y ahi se actualizaria las tablas que tengo

try {
  $pdo->beginTransaction();


  $stmtSet = $pdo->prepare("REPLACE INTO sets (id, nombre, serie, fecha_lanzamiento, total_cartas, precio_sobre, logo_url, simbolo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

  $stmtCarta = $pdo->prepare("REPLACE INTO cartas (id, set_id, nombre, rareza, precio_base, imagen_url, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)");

  $totalSets = 0;
  $totalCartas = 0;

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

    // 8 parámetros exactos
    $stmtSet->execute([
      $setId,
      $setName,
      $series,
      $releaseDate,
      $totalCards,
      $price,
      $logo,
      $symbol
    ]);
    $totalSets++;

    $cards = $set['cards'] ?? [];
    if (is_array($cards)) {
      foreach ($cards as $card) {
        $cardId = $card['id'] ?? '';
        $cardName = $card['name'] ?? '';
        $rarity = $card['rarity'] ?? 'Common';
        $basePrice = floatval($card['basePrice'] ?? $card['price'] ?? 0);
        $image = $card['image'] ?? '';

        // Determinar el tipo (cadena o primer elemento del array de tipos)
        $type = 'Incoloro';
        if (isset($card['type']) && is_string($card['type'])) {
          $type = $card['type'];
        } elseif (isset($card['types']) && is_array($card['types']) && count($card['types']) > 0) {
          $type = $card['types'][0];
        }

        if (empty($cardId)) continue;


        $stmtCarta->execute([
          $cardId,
          $setId,
          $cardName,
          $rarity,
          $basePrice,
          $image,
          $type
        ]);
        $totalCartas++;
      }
    }
  }

  $pdo->commit();

  echo "<h2>✅ ¡Importación completada con éxito!</h2>";
  echo "<p>Se han importado <strong>{$totalSets}</strong> expansiones y <strong>{$totalCartas}</strong> cartas a MySQL.</p>";
} catch (Exception $e) {
  if ($pdo->inTransaction()) {
    $pdo->rollBack();
  }
  echo "❌ Error durante la importación: " . $e->getMessage();
}
