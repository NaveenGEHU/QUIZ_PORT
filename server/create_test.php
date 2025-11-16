<?php
header('Content-Type: application/json');
include 'conn.php';
include 'JsonResponse.php';

$key = $_POST['key'] ?? '';
if ($key == '') {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Key can\'t be empty')->output();
    exit;
}

$query = "CREATE TABLE IF NOT EXISTS `$key` (
    q_no INT AUTO_INCREMENT PRIMARY KEY,
    statement VARCHAR(100),
    opt1 VARCHAR(60),
    opt2 VARCHAR(60),
    opt3 VARCHAR(60),
    opt4 VARCHAR(60),
    answer VARCHAR(60)
)";
if (!mysqli_query($conn, $query)) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Error creating table')->output();
    exit;
}

$statement = $_POST['statement'] ?? '';
$opt1 = $_POST['opt1'] ?? '';
$opt2 = $_POST['opt2'] ?? '';
$opt3 = $_POST['opt3'] ?? '';
$opt4 = $_POST['opt4'] ?? '';
$answer = $_POST['answer'] ?? '';

if ($statement === '' || $opt1 === '' || $opt2 === '' || $opt3 === '' || $opt4 === '' || $answer === '') {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('All fields are required')->output();
    exit;
}

$query = "INSERT INTO `$key` (statement, opt1, opt2, opt3, opt4, answer) VALUES ('$statement', '$opt1', '$opt2', '$opt3', '$opt4', '$answer')";
if (mysqli_query($conn, $query)) {
    $response = new JsonResponse();
    $response->setSuccess(true)->setMessage('Question inserted successfully')->output();
} else {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Failed to insert question')->output();
}
?>
