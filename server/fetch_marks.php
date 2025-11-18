<?php
include 'conn.php';
include 'JsonResponse.php';

header('Content-Type: application/json');
$testKey = trim($_POST['key'] ?? '');
$sortType = trim($_POST['sorttype'] ?? '');
$section = trim($_POST['section'] ?? '');
$course = trim($_POST['course'] ?? '');
if ($testKey === '') {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Key is required.')->output();
    exit;
}
$tableName = "result" . $testKey;

$tableCheck = mysqli_query($conn, "SHOW TABLES LIKE '$tableName'");
if (mysqli_num_rows($tableCheck) == 0) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('No results found for this test key.')->output();
    exit;
}


$query = "SELECT * FROM `$tableName`";


if ($sortType === 'sectionwise') {
  
    if ($section !== '' && $course !== '') {
        $query .= " WHERE section='$section' AND course='$course'";
    } else {
        $response = new JsonResponse();
        $response->setSuccess(false)->setMessage('Section and course are required for sectionwise sorting.')->output();
        exit;
    }
}


$result = mysqli_query($conn, $query);


if (!$result || $result->num_rows == 0) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('No data found.')->output();
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}


if ($sortType === 'markswise') {
  
    usort($data, function($a, $b) {
        return $b['marks'] <=> $a['marks'];
    });
} elseif ($sortType === 'sectionwise') {
    
    usort($data, function($a, $b) {
        return strcmp($a['rollno'], $b['rollno']);
    });
}

$response = new JsonResponse();
$response->setSuccess(true)->setData('results', $data)->output();
?>
