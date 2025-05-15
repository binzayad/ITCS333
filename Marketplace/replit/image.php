<?php
require_once 'config.php';
require_once 'DatabaseHelper.php';

$db = new DatabaseHelper(
    $config['host'],
    $config['dbname'],
    $config['username'],
    $config['password'],
    $config['options']
);

if (!isset($_GET['id'])) {
    http_response_code(400);
    exit('Missing id');
}

$stmt = $db->prepare("SELECT Image FROM Item WHERE ItemID = ?");
$stmt->execute([$_GET['id']]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if ($row && $row['Image']) {
    header('Content-Type: image/jpeg');
    echo $row['Image'];
} else {
    http_response_code(404);
}