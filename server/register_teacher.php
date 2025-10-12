<?php
// header('Content-Type: application/json');
include 'conn.php';
$name = isset($_POST['name']) ? mysqli_real_escape_string($conn, $_POST['name']) : '';
$email = isset($_POST['email']) ? mysqli_real_escape_string($conn, $_POST['email']) : '';
$password = isset($_POST['password']) ? mysqli_real_escape_string($conn, $_POST['password']) : '';
if($name ==='' || $email==='' || $password=='')
{
    exit;
}
$query="INSERT INTO teacher(name, email,password) VALUES('$name','$email','$password')";
if(mysqli_query($conn,$query))
{
    echo"REGISTRATION SUCCESSFUL";
}
else
{
    echo"REGISTRATION FAILED";
}

?>