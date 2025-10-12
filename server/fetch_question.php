<?php
    include 'conn.php';
    $key=isset($_POST['key']) ? $_POST['key'] : '';
    if($key==='')
    {
        exit;
    }
    $query=""
    $query=mysqli_connect(conn,query);
    // add quesry to check the table exist or not;
?>