<?php
// header('Content-Type: application/json');
include 'conn.php';
$id = $_POST['id'];
$name = $_POST['name'];
$password = $_POST['password'];
$section = $_POST['section'] ;
$course = $_POST['course'];
$rollno = $_POST['rollno'];
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