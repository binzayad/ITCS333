<?php
require_once 'config.php';

class DatabaseHelper {
    private $host;
    private $dbName;
    private $username;
    private $password;
    private $options;
    private $pdo;

    /**
     * Constructor
     */
    public function __construct($host, $dbName, $username, $password, $options = []) {
        $this->host = $host;
        $this->dbName = $dbName;
        $this->username = $username;
        $this->password = $password;
        $this->options = $options;
    }

    /**
     * Get PDO connection
     */
    public function getPDO() {
        if (!$this->pdo) {
            try {
                // Create connection to MySQL server
                $dsn = "mysql:host={$this->host};dbname={$this->dbName};charset=utf8mb4";
                $this->pdo = new PDO($dsn, $this->username, $this->password, $this->options);
            } catch (PDOException $e) {
                // If database doesn't exist, create it
                if ($e->getCode() == 1049) {
                    $this->createDatabase();
                    // Try connection again with the new database
                    $dsn = "mysql:host={$this->host};dbname={$this->dbName};charset=utf8mb4";
                    $this->pdo = new PDO($dsn, $this->username, $this->password, $this->options);
                } else {
                    throw $e;
                }
            }
        }
        return $this->pdo;
    }

    /**
     * Create database if it doesn't exist
     */
    private function createDatabase() {
        try {
            $pdo = new PDO("mysql:host={$this->host}", $this->username, $this->password, $this->options);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$this->dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch (PDOException $e) {
            die("Error creating database: " . $e->getMessage());
        }
    }

    /**
     * Execute a query
     */
    public function query($sql) {
        return $this->getPDO()->query($sql);
    }

    /**
     * Prepare a statement
     */
    public function prepare($sql) {
        return $this->getPDO()->prepare($sql);
    }

    /**
     * Execute SQL
     */
    public function exec($sql) {
        return $this->getPDO()->exec($sql);
    }
  
public function createUser() {
    $sql = "CREATE TABLE IF NOT EXISTS User (
        Username VARCHAR(50) NOT NULL PRIMARY KEY,
        UserFullName VARCHAR(50) NOT NULL,
        Password VARCHAR(255) NOT NULL,
        Email VARCHAR(100) NOT NULL UNIQUE,
        Avatar BLOB NOT NULL,
        Phone VARCHAR(8) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

    $this->exec($sql);
}

public function createItem() {
    $sql = "CREATE TABLE IF NOT EXISTS Items (
        ItemID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(50) NOT NULL,
        Image BLOB,
        Price DECIMAL(10,2) NOT NULL,
        Description TEXT NOT NULL,
        Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        Location VARCHAR(50) NOT NULL,
        Category VARCHAR(50) NOT NULL DEFAULT 'other'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

    $this->exec($sql);
}

public function createComment() {
    $sql = "CREATE TABLE IF NOT EXISTS Comment (
        CommentID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(50) NOT NULL,
        ItemID INT NOT NULL,
        Text VARCHAR(255) NOT NULL,
        FOREIGN KEY (Username) REFERENCES User(Username) ON DELETE CASCADE,
        FOREIGN KEY (ItemID) REFERENCES Item(ItemID) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

    $this->exec($sql);
}

public function createLike() {
    $sql = "CREATE TABLE IF NOT EXISTS Like (
        Username VARCHAR(50) NOT NULL,
        CommentID INT NOT NULL,
        BLN BOOLEAN NOT NULL ,
        FOREIGN KEY (Username) REFERENCES User(Username) ON DELETE CASCADE,
        FOREIGN KEY (CommentID) REFERENCES Comment(CommentID) ON DELETE CASCADE,
        UNIQUE KEY unique_user_comment (Username, CommentID)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

    $this->exec($sql);
      }

public function getItems(){
   $stmt = $this->prepare("SELECT * FROM Items");
   $stmt->execute();
  return $stmt->fetchAll();
}

public function getComments($ItemID){
   $stmt = $this->prepare("SELECT * FROM Comments WHERE ItemID = ?");
   $stmt->execute([$ItemID]);
   return $stmt->fetchAll();
}

public function deletItem($ItemID){
   $stmt = $this->prepare("DELETE FROM Items WHERE ItemID = ?");
   return $stmt->execute([$ItemID]);

}

public function getItemData($ItemID){
   $stmt = $this->prepare("SELECT * FROM Items WHERE ItemID = ?");
   $stmt->execute([$ItemID]);
  return $stmt->fetchAll();
}

public function addlike($CommentID,$Username,$BLN){
   $stmt = $this->prepare("INSERT INTO Likes (CommentID,Username,BLN) VALUES (?,?,?)");
   return $stmt->execute([$CommentID,$Username,$BLN]);
    //BLN is a boolean value that indicates whether the user liked or disliked the comment
}
public function addItem($Name,$Price,$Description,$Location,$Category){
    
    $this->createItem();
    
    
 $stmt = $this->prepare("INSERT INTO `Items` (`Name`, `Price`, `Description`, `Location`, `Category`) VALUES (?,?,?,?,?)");

    
return $stmt->execute([$Name,$Price,$Description,$Location,$Category]);
    
    }
}
?>
