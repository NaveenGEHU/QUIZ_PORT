<?php
header('Content-Type: application/json');
include "conn.php";
include "JsonResponse.php";

// Handle login
$input = json_decode(file_get_contents('php://input'), true);
$id = trim($input['id'] ?? '');
$password = trim($input['password'] ?? '');

// Fetch all students
$sql = "SELECT * FROM student";
$result = mysqli_query($conn, $sql);

if (!$result) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Database error.')->output();
    exit;
}

// Build Hash Table (ID → Row)
$hash = [];
while ($row = mysqli_fetch_assoc($result)) {
    $hash[$row['id']] = $row;
}

// Direct lookup without isset()
$user = $hash[$id] ?? null;

// Validate login
if ($user && $user['password'] === $password) {
    $response = new JsonResponse();
    $response->setSuccess(true)->setData('user', $user)->output();
} 
elseif($user && $user['password'] != $password){
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Incorrect password.')->output();
}
else {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Account not found ! Register first.')->output();
}
?>
