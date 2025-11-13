<?php
// header('Content-Type: application/json');
include 'conn.php';
$key=$_POST['key'];
if($key=='')
{
    echo "Key can't be empty";
    exit;
}
    $query="CREATE TABLE IF NOT EXISTS `$key`
    ( q_no INT AUTO_INCREMENT PRIMARY KEY,
    statement VARCHAR(100) ,
    opt1 VARCHAR(60) ,
    opt2 VARCHAR(60) ,
    opt3 VARCHAR(60) ,
    opt4 VARCHAR(60) ,
    answer VARCHAR(60) 
    ) ";
if( !(mysqli_query($conn,$query)) )
{
    echo "Error creating table";
    exit;
}
$statement = $_POST['statement'];
$opt1 = $_POST['opt1'];
$opt2 = $_POST['opt2'];
$opt3 = $_POST['opt3'];
$opt4 = $_POST['opt4'];
$answer= $_POST['answer'];

if ($statement === '' || $opt1 ==='' || $opt2 === '' || $opt3 === '' || $opt4 === '' || $answer === '') {
    echo "All fields are required";
    exit;
}
$query="INSERT INTO `$key` (statement,opt1,opt2,opt3,opt4,answer) VALUES('$statement','$opt1','$opt2','$opt3','$opt4','$answer')";
if(mysqli_query($conn,$query))
{
    echo"QUESTION INSERTED";
}
else
{
    echo"ERRO FAILED TO INSERT QUESTION";
}

?>