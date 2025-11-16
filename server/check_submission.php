<?php
header('Content-Type: application/json');
include 'conn.php';
include 'JsonResponse.php';

$key = $_POST['key'] ?? '';         // ?? checks of key is not null if null assign  ''
$student_id = $_POST['student_id'] ?? '';

if ($key === '' || $student_id === '') {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Invalid data')->output();
    exit;
}

$result_table = "result" . $key;

// Check if result table exists
$query = "SHOW TABLES LIKE '$result_table'";
$result = mysqli_query($conn, $query);

if (!$result || mysqli_num_rows($result) == 0) {
    // Table doesn't exist, so no submission yet
    $response = new JsonResponse();
    $response->setSuccess(true)->setData('already_submitted', false)->output();
    exit;
}

// Check if student has already submitted
$query = "SELECT id FROM `$result_table` WHERE id = '$student_id'";
$result = mysqli_query($conn, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $response = new JsonResponse();
    $response->setSuccess(true)->setData('already_submitted', true)->output();
} else {
    $response = new JsonResponse();
    $response->setSuccess(true)->setData('already_submitted', false)->output();
}
?>
