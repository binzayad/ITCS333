<?php
require_once 'db.php';
$stmt = $pdo->query("SELECT * FROM groups ORDER BY time DESC");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));