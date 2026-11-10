<?php
header("Content-Type: application/json; charset=UTF-8");
require_once "conexion.php";

try {
    // 1. Obtener todos los sets (usamos logo_url AS logo)
    $sqlSets = "SELECT id AS setId, nombre AS setName, serie AS series, precio_sobre AS packPrice, logo_url AS logo, simbolo_url AS symbol FROM sets";
    $stmtSets = $pdo->prepare($sqlSets);
    $stmtSets->execute();
    $sets = $stmtSets->fetchAll(PDO::FETCH_ASSOC);

    // 2. Obtener las cartas para cada set
    foreach ($sets as &$set) {
        $set['packPrice'] = floatval($set['packPrice']);

        $sqlCartas = "SELECT id, nombre AS name, rareza AS rarity, precio_base AS basePrice, imagen_url AS image, tipo AS type FROM cartas WHERE set_id = ?";
        $stmtCartas = $pdo->prepare($sqlCartas);
        $stmtCartas->execute([$set['setId']]);
        $cartas = $stmtCartas->fetchAll(PDO::FETCH_ASSOC);

        foreach ($cartas as &$c) {
            $c['basePrice'] = floatval($c['basePrice']);
        }

        $set['cards'] = $cartas;
    }

    echo json_encode($sets);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "mensaje" => "Error al obtener sobres: " . $e->getMessage()]);
}
?>