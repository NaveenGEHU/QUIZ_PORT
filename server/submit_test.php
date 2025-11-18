<?php
header('Content-Type: application/json');
include 'conn.php';
include 'JsonResponse.php';

$key = $_POST['key'] ?? '';
$responses = json_decode($_POST['responses'] ?? '[]', true);
$student_id = $_POST['student_id'] ?? '';
$student_name = $_POST['student_name'] ?? '';
$student_section = $_POST['student_section'] ?? '';
$student_course = $_POST['student_course'] ?? '';
$student_rollno = $_POST['student_rollno'] ?? '';

if ($key === '' || empty($responses) || $student_id === '' || $student_name === '' || $student_section === '' || $student_course === '' || $student_rollno === '') {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Invalid data')->output();
    exit;
}

// Fetch correct answers from the test table
$query = "SELECT q_no, answer FROM `$key` ORDER BY q_no";
$result = mysqli_query($conn, $query);

if (!$result || $result->num_rows == 0) {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Test not found')->output();
    exit;
}

$correct_answers = [];
while ($row = $result->fetch_assoc()) {
    $correct_answers[$row['q_no']] = $row['answer'];
}

// Calculate marks
$marks = 0;
foreach ($responses as $q_no => $response) {
    if (isset($correct_answers[$q_no]) && $response === $correct_answers[$q_no]) {
        $marks++;
    }
}

// Create result table if not exists
$result_table = "result" . $key;
$query = "CREATE TABLE IF NOT EXISTS `$result_table` (
    id INT(10) PRIMARY KEY,
    name VARCHAR(50),
    section VARCHAR(5),
    course VARCHAR(15),
    rollno INT(4),
    marks INT(5)
)";
mysqli_query($conn, $query);

// Insert result only if not already exists (prevent multiple submissions)
$query = "INSERT IGNORE INTO `$result_table` (id, name, section, course, rollno, marks) VALUES ('$student_id', '$student_name', '$student_section', '$student_course', '$student_rollno', '$marks')";
if (mysqli_query($conn, $query)) {
    $affected_rows = mysqli_affected_rows($conn);
    if ($affected_rows > 0) {
        $response = new JsonResponse();
        $response->setSuccess(true)->output();
    } else {
        $response = new JsonResponse();
        $response->setSuccess(false)->setMessage('You have already submitted this test. Multiple submissions are not allowed.')->output();
    }
} else {
    $response = new JsonResponse();
    $response->setSuccess(false)->setMessage('Failed to save result')->output();
}
?>
