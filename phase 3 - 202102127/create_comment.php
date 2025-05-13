<?php
require 'db.php';
$data = json_decode(file_get_contents('php://input'), true);
foreach (['group_id','text'] as $f) {
    if (empty($data[$f])) { http_response_code(400); exit(json_encode(['error'=>"$f required"])); }
}
$stmt = $pdo->prepare("INSERT INTO comments (group_id,text)
                         VALUES(:gid,:txt)");
$stmt->execute([':gid'=> (int)$data['group_id'], ':txt'=>htmlspecialchars($data['text'])]);
http_response_code(201);
echo json_encode(['message'=>'Comment added']);
?>