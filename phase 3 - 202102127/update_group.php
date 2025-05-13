<?php
require 'db.php';
$data = json_decode(file_get_contents('php://input'), true);
if (empty($data['id'])) { http_response_code(400); exit(json_encode(['error'=>'id required'])); }
$id = (int)$data['id'];
$fields = ['name','course','time','location','description'];
$sets = [];$params=[':id'=>$id];
foreach ($fields as $f) {
    if (isset($data[$f])) {
        $sets[] = "{$f} = :{$f}";
        $params[":{$f}"] = htmlspecialchars($data[$f]);
    }
}
if (!$sets) { http_response_code(400); exit(json_encode(['error'=>'nothing to update'])); }
$sql = "UPDATE groups SET " . implode(',',$sets) . " WHERE id=:id";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
echo json_encode(['message'=>'Updated']);
?>