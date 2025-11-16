<?php
header('Content-Type: application/json');
include 'conn.php';
include 'JsonResponse.php';

$teacher_email = $_POST['teacher_email'] ?? '';
if ($teacher_email == '') {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Teacher email is required')->output();
    exit;
}

$query = "SELECT test_created FROM namesoftest WHERE teacher_email='$teacher_email'";
$result = mysqli_query($conn, $query);
$data = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    $response = new JsonResponse();
    $response->setSuccess(true)->setData('test_keys', $data)->output();
} else {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('No test keys found')->output();
}
?>
