<?php
header('Content-Type: application/json');
include 'conn.php';
include 'JsonResponse.php';
$test_created = trim($_POST['test_created'] ?? '');
$teacher_email = trim($_POST['teacher_email'] ?? '');

if ($test_created === '' || $teacher_email === '') {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Test key and teacher email are required.')->output();
    exit;
}

$query = "INSERT INTO `namesoftest` (test_created, teacher_email) VALUES('$test_created', '$teacher_email')";
if (mysqli_query($conn, $query)) {
    $response = new JsonResponse();
    $response->setSuccess(true)->setMessage('Test key mapped successfully.')->output();
} else {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Failed to map test key.')->output();
}
?>
