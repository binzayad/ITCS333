<?php
$host = 'localhost';  
$db   = 'mydb';    
$user = 'user1';        
$pass = 'abcd1234';    

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass);
    // No echo here (just silent connection)
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
?>
