<?php
require 'db.php';
$id = (int)($_GET['id'] ?? 0);
if (!$id) { http_response_code(400); exit(json_encode(['error'=>'id required'])); }
$stmt = $pdo->prepare("SELECT * FROM groups WHERE id=:id");
$stmt->execute([':id'=>$id]);
$g = $stmt->fetch();
if (!$g) { http_response_code(404); exit(json_encode(['error'=>'Not found'])); }
header('Content-Type:application/json');
echo json_encode($g);
?>