<?php
header('Content-Type: application/json');
include "conn.php";
include "JsonResponse.php";

// Handle login
$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['teacher_email'] ?? '');
$password = trim($input['teacher_password'] ?? '');

// Fetch all teachers
$sql = "SELECT * FROM teacher";
$result = mysqli_query($conn, $sql);

if (!$result) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Database error.')->output();
    exit;
}

// Build Hash Table (Email → Row)
$hash = [];
while ($row = mysqli_fetch_assoc($result)) {
    $hash[$row['email']] = $row;
}

// Direct lookup without isset()
$user = $hash[$email] ?? null;

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
