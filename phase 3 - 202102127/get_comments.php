<?php
require 'db.php';
$id = (int)($_GET['group_id'] ?? 0);
if (!$id) { http_response_code(400); exit(json_encode(['error'=>'group_id required'])); }
$stmt = $pdo->prepare("SELECT * FROM comments WHERE group_id=:gid ORDER BY created_at DESC");
$stmt->execute([':gid'=>$id]);
header('Content-Type:application/json');
echo json_encode($stmt->fetchAll());
?>