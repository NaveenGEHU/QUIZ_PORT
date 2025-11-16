<?php
header('Content-Type: application/json');
include 'conn.php';
include 'JsonResponse.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$id = trim($input['id'] ?? '');
$name = trim($input['name'] ?? '');
$password = trim($input['password'] ?? '');
$section = trim($input['section'] ?? '');
$course = trim($input['course'] ?? '');
$rollno = trim($input['rollno'] ?? '');

// Fetch all students
$sql = "SELECT * FROM student";
$result = mysqli_query($conn, $sql);

if (!$result) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Database error.')->output();
    exit;
}

// Build Hash Table for ID (unique)
$hash_id = [];
while ($row = mysqli_fetch_assoc($result)) {
    $hash_id[$row['id']] = $row;
}

// Check for duplicate id
if (isset($hash_id[$id])) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('REGISTRATION FAILED! Student ID already exists!')->output();
    exit;
}

// Insert new student
$query = "INSERT INTO student(id, name, password, section, course, rollno) VALUES('$id', '$name', '$password', '$section', '$course', '$rollno')";
if (mysqli_query($conn, $query)) {
    $response = new JsonResponse();
    $response->setSuccess(true)->setMessage('REGISTRATION SUCCESSFUL')->output();
} else {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('REGISTRATION FAILED')->output();
}
?>
