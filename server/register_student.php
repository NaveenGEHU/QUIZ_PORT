<?php
// header('Content-Type: application/json');
include 'conn.php';
$id = isset($_POST['id']) ? mysqli_real_escape_string($conn, $_POST['id']) : '';
$name = isset($_POST['name']) ? mysqli_real_escape_string($conn, $_POST['name']) : '';
$password = isset($_POST['password']) ? mysqli_real_escape_string($conn, $_POST['password']) : '';
$section = isset($_POST['section']) ? mysqli_real_escape_string($conn, $_POST['section']) : '';
$course = isset($_POST['course']) ? mysqli_real_escape_string($conn, $_POST['course']) : '';
$rollno = isset($_POST['rollno']) ? mysqli_real_escape_string($conn, $_POST['rollno']) : '';
if($id ==='' || $name ==='' ||   $password ==='' || $section ==='' ||  $course ==='' ||  $rollno ==='' )
{
    exit;
}
$query="INSERT INTO student(id ,name,password,section,course,rollno) VALUES('$id','$name','$password','$section','$course','$rollno')";
if(mysqli_query($conn,$query))
{
    echo"REGISTRATION SUCCESSFUL";
}
else
{
    echo"REGISTRATION FAILED";
}

?>