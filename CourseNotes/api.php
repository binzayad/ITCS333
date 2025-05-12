<?php
ob_start();
// Database configuration
$host = 'localhost';
$db = 'm202100578a';
$user = 'cn37m3x3hfwf';
$pass = 'cm4cy98mx4xio';
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database connection failed'
    ]);
    exit();
}
$action = $_GET['action'] ?? '';
if ($action) {
    header('Content-Type: application/json');
    switch ($action) {
        case 'get_notes':
            $page = $_GET['page'] ?? 1;
            $perPage = 8;
            $search = $_GET['search'] ?? '';
            $sort = $_GET['sort'] ?? '';
            $whereClause = '';
            if ($search) {
                $whereClause = "WHERE title LIKE :search OR content LIKE :search";
            }
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM notes $whereClause");
            if ($search)
                $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
            $stmt->execute();
            $totalNotes = $stmt->fetchColumn();
            $totalPages = ceil($totalNotes / $perPage);
            $orderBy = "created_at DESC";
            if ($sort === 'asc')
                $orderBy = "title ASC";
            elseif ($sort === 'desc')
                $orderBy = "title DESC";
            $offset = ($page - 1) * $perPage;
            $sql = "SELECT * FROM notes $whereClause ORDER BY $orderBy LIMIT :limit OFFSET :offset";
            $stmt = $pdo->prepare($sql);
            if ($search)
                $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
            $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);
            ob_clean();
            echo json_encode([
                'notes' => $notes,
                'totalPages' => $totalPages,
                'currentPage' => (int) $page
            ]);
            exit();
        case 'add_note':
            $data = json_decode(file_get_contents('php://input'), true);
            if (! $data || ! isset($data['title']) || ! isset($data['content'])) {
                http_response_code(400);
                echo json_encode([
                    'error' => 'Invalid input'
                ]);
                exit();
            }
            $date = $data['date'] ?? null;
            $important = $data['important'] ? 1 : 0;
            $stmt = $pdo->prepare("INSERT INTO notes (title, content, note_date, is_important) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['title'],
                $data['content'],
                $date,
                $important
            ]);
            echo json_encode([
                'success' => true
            ]);
            exit();
        case 'delete_note':
            $id = $_GET['id'] ?? null;
            if (! $id || ! is_numeric($id)) {
                http_response_code(400);
                echo json_encode([
                    'error' => 'Invalid ID'
                ]);
                exit();
            }
            $stmt = $pdo->prepare("DELETE FROM notes WHERE id = ?");
            $stmt->execute([
                $id
            ]);
            echo json_encode([
                'success' => true
            ]);
            exit();
        case 'get_all_comments':
            $stmt = $pdo->query("SELECT * FROM comments ORDER BY created_at DESC");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            exit();
        case 'add_comment':
            $data = json_decode(file_get_contents('php://input'), true);
            if (! $data || ! isset($data['text'])) {
                http_response_code(400);
                echo json_encode([
                    'error' => 'Comment text is required'
                ]);
                exit();
            }
            $stmt = $pdo->prepare("INSERT INTO comments (text) VALUES (?)");
            $stmt->execute([
                $data['text']
            ]);
            echo json_encode([
                'success' => true
            ]);
            exit();
        case 'delete_comment':
            $id = $_GET['id'] ?? null;
            if (! $id || ! is_numeric($id)) {
                http_response_code(400);
                echo json_encode([
                    'error' => 'Invalid ID'
                ]);
                exit();
            }
            $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
            $stmt->execute([
                $id
            ]);
            echo json_encode([
                'success' => true
            ]);
            exit();
        case 'get_note_by_id':
            $id = $_GET['id'] ?? null;
            if (! $id || ! is_numeric($id)) {
                http_response_code(400);
                echo json_encode([
                    'error' => 'Invalid ID'
                ]);
                exit();
            }
            $stmt = $pdo->prepare("SELECT * FROM notes WHERE id = ?");
            $stmt->execute([
                $id
            ]);
            $note = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($note) {
                echo json_encode($note);
            } else {
                http_response_code(404);
                echo json_encode([
                    'error' => 'Note not found'
                ]);
            }
            exit();
        default:
            http_response_code(400);
            echo json_encode([
                'error' => 'Unknown action'
            ]);
            exit();
    }
}
ob_clean(); // Clear buffer before sending HTML
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Course Notes</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="style.css">
</head>
<body>
	<nav id="nav">
		<a style="font-size: 30px">Course Notes</a>
	</nav>
	<hr>
	<button id="navigate">↑</button>
	<main>
		<h1>Notes</h1>
		<!-- Search & Sort -->
		<input id="search" type="search" placeholder="Search notes...">
		<button type="submit" id="searchbtn">Search</button>
		<button class="sort" data-sort="asc">A-Z</button>
		<button class="sort" data-sort="desc">Z-A</button>
		<button class="reset">Reset</button>
		<hr>
		<a href="AddNewItemPage.html" target="_blank" class="link"><button>Add
				new Item</button></a>
		<div id="notes"></div>
		<!-- Pagination -->
		<div id="page">
			<a id="firstPage"> |< </a> <a class="page" id="prevPage"> < </a> <span
				id="currentPage">1</span> <a class="page" id="nextPage"> > </a> <a
				id="lastPage"> >| </a>
		</div>
		<!-- Comments -->
		<label>Add a Comment:-</label>
		<textarea id="comment" rows="4" cols="40"></textarea>
		<button id="publish">Publish</button>
		<div>
			<p>Comments:</p>
			<hr>
			<div id="commentSection"></div>
		</div>
	</main>
	<footer>
		<hr>
		<p>
			<small>UOB, <time>2025</time></small>
		</p>
	</footer>
	<script src="main.js" type="text/javascript"></script>
</body>
</html>