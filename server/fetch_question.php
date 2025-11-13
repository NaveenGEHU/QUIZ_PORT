<?php
    // header('Content-Type: application/json'); // JSON RESPONSE
    include 'conn.php';
    $key=$_POST['key'];
    if($key==='')
    {
        exit;
    }
    // $query="SELECT * FROM `$key`";
    // $data=[];
    // $result = @mysqli_query($conn, $query); // @ suppresses SQL warnings
    // if(!($result &&  $result->num_rows>0  ))
    // {
    //     exit;
    // }
    // while($row = $result->fetch_assoc())
    // {
    //     $data[]=$row;
    // }
    // echo json_encode($data);


    try {
    $query = "SELECT * FROM `$key`";
    $result = mysqli_query($conn, $query);

    if (!($result && $result->num_rows > 0)) 
        exit;

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
    } catch (mysqli_sql_exception $e) {
        // Table not found or other SQL error – exit silently
        exit;
    }
        // add quesry to check the table exist or not;
?>