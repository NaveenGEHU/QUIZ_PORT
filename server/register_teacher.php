<?php
// header('Content-Type: application/json');
include 'conn.php';
$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];
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