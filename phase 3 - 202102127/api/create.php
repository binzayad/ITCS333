<?php
require_once 'db.php';
$data = json_decode(file_get_contents("php://input"), true);
$stmt = $pdo->prepare("INSERT INTO groups (name, course, time, location, description) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$data['name'], $data['course'], $data['time'], $data['location'], $data['description']]);
echo json_encode(['success' => true]);