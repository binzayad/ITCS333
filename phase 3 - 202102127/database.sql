CREATE DATABASE IF NOT EXISTS study_groups;
USE study_groups;
CREATE TABLE IF NOT EXISTS groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  course VARCHAR(255),
  time DATETIME,
  location VARCHAR(255),
  description TEXT
);