<?php
require 'db.php';
$limit  = (int)($_GET['limit'] ?? 10);
$offset = (int)($_GET['offset'] ?? 0);
$search = $_GET['search'] ?? null;
$course = $_GET['course'] ?? null;

$sql = "SELECT * FROM groups";
$parts = [];
$params = [];
if ($search) {
    $parts[] = "(name LIKE :s OR location LIKE :s)";
    $params[':s'] = "%$search%";
}
if ($course && $course!=='All') {
    $parts[] = "course = :c";
    $params[':c'] = $course;
}
if ($parts) $sql .= ' WHERE '.implode(' AND ',$parts);
$sql .= " ORDER BY meeting_time DESC LIMIT :l OFFSET :o";
$stmt = $pdo->prepare($sql);
$stmt->bindValue(':l',$limit,PDO::PARAM_INT);
$stmt->bindValue(':o',$offset,PDO::PARAM_INT);
foreach ($params as $k=>$v) $stmt->bindValue($k,$v);
$stmt->execute();
header('Content-Type:application/json');
echo json_encode($stmt->fetchAll());
?>