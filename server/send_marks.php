<?php
    include 'conn.php';
    $key=$_POST['key'];
    $key="result".$key;
    if($key=='')
    {
        exit;
    }
    $query ="CREATE TABLE IF NOT EXISTS `$key`
    ( id INT(10) PRIMARY KEY,
    name VARCHAR(50) ,
    section VARCHAR(5) ,
    course VARCHAR(15) ,
    rollno INT(4) ,
    marks INT(5) 
    ) ";
    $result=mysqli_query($conn,$query);
   if(!$result)
   {
    echo"Error cant perform !";
    exit;
   }

    $id = $_POST['id'];
    $name = $_POST['name'];
    $section = $_POST['section'];
    $course = $_POST['course'];
    $rollno = $_POST['rollno'];
    $marks = $_POST['marks'];
    $query="INSERT INTO `$key`(id, name,section,course,rollno,marks) VALUES(  '$id', '$name' ,'$section' ,'$course' ,'$rollno' ,'$marks' )";
    if(mysqli_query($conn,$query))
    {
        echo"DATA INSERTED";
    }
    else
    {
        echo"ERRO FAILED TO INSERT DATA";
    }

?>