<?php
require 'db.php';
$data = json_decode(file_get_contents('php://input'), true);
$id = (int)($data['id'] ?? 0);
if (!$id) { http_response_code(400); exit(json_encode(['error'=>'id required'])); }
$stmt = $pdo->prepare("DELETE FROM groups WHERE id=:id");
$stmt->execute([':id'=>$id]);
echo json_encode(['message'=>'Deleted']);
?>