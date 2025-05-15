<?php

// Allow requests from any origin (replace * with your frontend's URL for better security)
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

header('Content-Type: application/json');


require_once 'config.php';
require_once 'DatabaseHelper.php';

$db = new DatabaseHelper(
    $config['host'],
    $config['dbname'],
    $config['username'],
    $config['password'],
    $config['options']
);

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'getItems':
        Items($db);
        break;
    case 'upload':
        addItem($db);
        break;
    case 'update':
        updateItem($db);
        break;
    case 'delete':
        deleteItem($db);
        break;
    case 'comment':
        Comment($db);
        break;
    case 'itemData':
        itemData($db);
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        break;
}

function deleteItem($db) {
    if (!isset($_GET['id'])) {
        echo json_encode(['status' => 'error', 'message' => 'Item ID is required']);
        return;
    }

    try {
        $stmt = $db->prepare("DELETE FROM Item WHERE ItemID = ?");
        $success = $stmt->execute([$_GET['id']]);

        if ($success) {
            echo json_encode(['status' => 'success', 'message' => 'Item deleted successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to delete item']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateItem($db) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['ItemID'])) {
        echo json_encode(['status' => 'error', 'message' => 'ItemID is required']);
        return;
    }

    try {
        $result = $db->prepare("UPDATE Item SET Name = ?, Price = ?, Description = ?, Location = ? WHERE ItemID = ?");
        $success = $result->execute([$data['Name'], $data['Price'], $data['Description'], $data['Location'], $data['ItemID']]);

        if ($success) {
            echo json_encode(['status' => 'success', 'message' => 'Item updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update item']);
        }
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

function addItem($db) {
    // Check required fields
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (    
        !isset($data['Name']) ||
        !isset($data['Price']) ||
        !isset($data['Category']) ||
        !isset($data['Location']) ||
        !isset($data['Description'])
       
    ) {
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        return;
    }
    

    // Handle image upload (store as BLOB)

    try {
        
        $result = $db -> addItem($data['Name'], $data['Price'], $data['Description'], $data['Location'], $data['Category']);
        
        
        if ($result) {
            echo json_encode(['status' => 'success', 'message' => 'Item added successfully']);
            
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to add Item']);
        }
        
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

function Comment($db) {
    if (!isset($_GET['itemID'])) {
        echo json_encode(['status' => 'error', 'message' => 'Item ID required']);
        return;
    }

    try {
        $stmt = $db->prepare("SELECT * FROM Comment WHERE ItemID = ?");
        $stmt->execute([$_GET['itemId']]);
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'comments' => $comments]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
}

function Items($db) {
    try {
        
        $items=$db->getItems();
        echo json_encode(['status' => 'success', 'items' => $items]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
    
}

function itemData($db){
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['id'])){
            echo json_encode(['status' => 'error', 'message' => 'Item ID required']);
            return;
        }
    
        try {
            $result = $db -> getItemData($data['id']);
            echo json_encode(['status' => 'success', 'files' => $result]);

        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
        }
}