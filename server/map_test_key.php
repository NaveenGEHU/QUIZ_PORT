<?php
// header('Content-Type: application/json');
include 'conn.php';
$test_created=$_POST['test_created'];
$teacher_email=$_POST['teacher_email'];
if($test_created=='' || $teacher_email=='')
{
    echo "Key can't be empty";
    exit;
}

$query="INSERT INTO `namesoftest` (test_created,teacher_email) VALUES('$test_created','$teacher_email')";
if(mysqli_query($conn,$query))
{
    echo"QUESTION INSERTED";
}
else
{
    echo"ERRO FAILED TO INSERT QUESTION";
}

?>