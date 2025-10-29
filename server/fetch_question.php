<?php
    include 'conn.php';
    $key=$_POST['key'];
    if($key==='')
    {
        exit;
    }
    $query="SELECT * FROM `$key`";
    $data=[];
    $result=mysqli_query($conn,$query);
    if(!($result &&  $result->num_rows>0  ))
    {
        echo json_encode("Test not found!");
        exit;
    }
    while($row = $result->fetch_assoc())
    {
        $data[]=$row;
    }
    echo json_encode($data);

    // add quesry to check the table exist or not;
?>