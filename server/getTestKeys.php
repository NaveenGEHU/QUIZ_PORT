<?php
// header('Content-Type: application/json');
include 'conn.php';
$teacher_email=$_POST['teacher_email'];
if( $teacher_email=='')
{
    exit;
}

$query= "SELECT test_created FROM namesoftest WHERE teacher_email='$teacher_email' ";
$result=mysqli_query($conn,$query);
$data=[];
if($result && $result->num_rows>0)
{
    while($row=$result->fetch_assoc())
    {
        $data[]=$row;
    }
}
echo json_encode($data);  //sends to JS

?>