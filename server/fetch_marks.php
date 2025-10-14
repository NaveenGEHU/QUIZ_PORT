<?php
    include 'conn.php';
    // header('Content-Type:appliation/json');
    $key=$_POST['key'];
    if($key==='')
    {
        exit;
    }
    $key="result".$key;
    $query="SELECT * FROM `$key`";
    $result=mysqli_query($conn,$query);
    if(!($result->num_rows>0))
    {
        echo"NO DATA FOUND";
        exit;
     
    }
       while($row=$result->fetch_assoc())
        {
            $data[]=$row;
        }
        echo json_encode($data);
?>