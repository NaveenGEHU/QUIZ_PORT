<?php
header('Content-Type: application/json');
include 'conn.php';
include 'JsonResponse.php';

$key = $_POST['key'] ?? '';
if ($key === '') {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Key is required')->output();
    exit;
}

try {
    $query = "SELECT q_no, statement, opt1, opt2, opt3, opt4 FROM `$key`";
    $result = mysqli_query($conn, $query);

    if (!($result && $result->num_rows > 0)) {
        $response = new JsonResponse();
        $response->setSuccess(false)->setMessage('No questions found')->output();
        exit;
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $response = new JsonResponse();
    $response->setSuccess(true)->setData('questions', $data)->output();
} catch (mysqli_sql_exception $e) {
    // Table not found or other SQL error – return error response
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Table not found or SQL error')->output();
}
?>
