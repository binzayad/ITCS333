<?php
require 'db.php';
$data = json_decode(file_get_contents('php://input'), true);
foreach (['name','course','time','location'] as $f) {
    if (empty($data[$f])) {
        http_response_code(400);
        exit(json_encode(['error'=>"$f is required"]));
    }
}
$stmt = $pdo->prepare(
    "INSERT INTO groups (name, course, meeting_time, location, description)
     VALUES (:name, :course, :time, :location, :description)"
);
$stmt->execute([
    ':name'=>htmlspecialchars($data['name']),
    ':course'=>htmlspecialchars($data['course']),
    ':time'=> $data['time'],
    ':location'=>htmlspecialchars($data['location']),
    ':description'=>htmlspecialchars($data['description'] ?? '')
]);
http_response_code(201);
echo json_encode(['message'=>'Created','id'=>$pdo->lastInsertId()]);
?>