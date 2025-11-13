<?php
    include 'conn.php';
    header('Content-Type:appliation/json');
    $key=$_POST['key'];
    if($key==='')
    {
        exit;
    }
    $key="result".$key;


    // ✅ Check if table exists
    $check = mysqli_query($conn, "SHOW TABLES LIKE '$key'");
    if (mysqli_num_rows($check) == 0) 
        exit;
    $query="SELECT * FROM `$key`";
    $result=mysqli_query($conn,$query);
    if(!($result->num_rows>0))
    {
        exit;
     
    }
       while($row=$result->fetch_assoc())
        {
            $data[]=$row;
        }
        echo json_encode($data);
?>