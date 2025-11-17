<?php
// Include necessary files for database connection and JSON response handling
include 'conn.php';
include 'JsonResponse.php';

// Set the response content type to JSON
header('Content-Type: application/json');

// Retrieve and sanitize input parameters from POST request
$testKey = trim($_POST['key'] ?? '');
$sortType = trim($_POST['sorttype'] ?? '');
$section = trim($_POST['section'] ?? '');
$course = trim($_POST['course'] ?? '');

// Validate that the test key is provided
if ($testKey === '') {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Key is required.')->output();
    exit;
}

// Construct the table name based on the test key
$tableName = "result" . $testKey;

// Check if the table exists in the database
$tableCheck = mysqli_query($conn, "SHOW TABLES LIKE '$tableName'");
if (mysqli_num_rows($tableCheck) == 0) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('No results found for this test key.')->output();
    exit;
}

// Build the base SQL query to select all records from the table
$query = "SELECT * FROM `$tableName`";

// Apply filtering for sectionwise sorting if specified
if ($sortType === 'sectionwise') {
    // Ensure both section and course are provided for filtering
    if ($section !== '' && $course !== '') {
        $query .= " WHERE section='$section' AND course='$course'";
    } else {
        $response = new JsonResponse();
        $response->setSuccess(false)->setMessage('Section and course are required for sectionwise sorting.')->output();
        exit;
    }
}

// Execute the query
$result = mysqli_query($conn, $query);

// Check if the query was successful and returned data
if (!$result || $result->num_rows == 0) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('No data found.')->output();
    exit;
}

// Fetch all rows into an array
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Apply sorting using PHP built-in functions instead of SQL ORDER BY
if ($sortType === 'markswise') {
    // Sort by marks in descending order (highest first)
    usort($data, function($a, $b) {
        return $b['marks'] <=> $a['marks'];
    });
} elseif ($sortType === 'sectionwise') {
    // Sort by rollno in ascending order (alphabetical/numerical)
    usort($data, function($a, $b) {
        return strcmp($a['rollno'], $b['rollno']);
    });
}

// Prepare and output the JSON response with the sorted data
$response = new JsonResponse();
$response->setSuccess(true)->setData('results', $data)->output();
?>
