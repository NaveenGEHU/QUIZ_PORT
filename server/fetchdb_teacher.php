<?php
    include "conn.php";
    // header('Content-Type: application/json'); // JSON RESPONSE
    $sql="SELECT * FROM teacher";
    $result=mysqli_query($conn,$sql);
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