<?php
header('Content-Type: application/json');
include 'conn.php';
include 'JsonResponse.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$name = $input['full_name'] ;
$email =$input['teacher_email'];
$password =$input['teacher_password'];

// Fetch all teachers
$sql = "SELECT * FROM teacher";
$result = mysqli_query($conn, $sql);

if (!$result) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Database error.')->output();
    exit;
}

// Build Hash Table for Email (unique)
$hash_email = [];
while ($row = mysqli_fetch_assoc($result)) {
    $hash_email[$row['email']] = $row;
}

// Check for duplicate email
if (isset($hash_email[$email])) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Account already exists! Please login.')->output();
    exit;
}

// Insert new teacher
$query = "INSERT INTO teacher(name, email, password) VALUES('$name', '$email', '$password')";
if (mysqli_query($conn, $query)) {
    $response = new JsonResponse();
    $response->setSuccess(true)->setMessage('REGISTRATION SUCCESSFUL')->output();
} else {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('REGISTRATION FAILED')->output();
}
?>
