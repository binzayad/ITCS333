<?php
 // CORS headers
 header("Access-Control-Allow-Origin: *");
 header("Content-Type: application/json; charset=UTF-8");
 header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
 header("Access-Control-Allow-Headers: Content-Type");

 // Handle preflight OPTIONS request
 if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
     http_response_code(204);
     exit;
 }

 $host = 'localhost';
 $db = 'mydb';
 $user = 'user1';
 $pass = 'abcd1234';

 $dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

 try {
     $pdo = new PDO($dsn, $user, $pass);
 } catch (PDOException $e) {
     http_response_code(500);
     echo json_encode(['error' => 'Database connection failed']);
     exit;
 }

 $method = $_SERVER['REQUEST_METHOD'];

 if ($method === 'GET') {
     $stmt = $pdo->query("SELECT * FROM course_reviews ORDER BY created_at DESC");
     $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
     echo json_encode($reviews);

 } elseif ($method === 'POST') {
     $data = json_decode(file_get_contents("php://input"), true);

     $stmt = $pdo->prepare("INSERT INTO course_reviews (course_name, review_text, rating, reviewer_name) VALUES (?, ?, ?, ?)");
     $stmt->execute([
         $data['course_name'],
         $data['review_text'],
         $data['rating'],
         $data['reviewer_name']
     ]);

     echo json_encode(['message' => 'Review added successfully']);

 } elseif ($method === 'PUT') {
     $data = json_decode(file_get_contents("php://input"), true);

     $stmt = $pdo->prepare("UPDATE course_reviews SET course_name = ?, review_text = ?, rating = ?, reviewer_name = ? WHERE id = ?");
     $stmt->execute([
         $data['course_name'],
         $data['review_text'],
         $data['rating'],
         $data['reviewer_name'],
         $data['id']
     ]);

     echo json_encode(['message' => 'Review updated successfully']);

 } elseif ($method === 'DELETE') {
     $data = json_decode(file_get_contents("php://input"), true);

     $stmt = $pdo->prepare("DELETE FROM course_reviews WHERE id = ?");
     $stmt->execute([$data['id']]);

     echo json_encode(['message' => 'Review deleted successfully']);
 } else {
     http_response_code(405);
     echo json_encode(['error' => 'Method not allowed']);
 }
 ?>