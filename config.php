<?php

$hostname ="localhost";
$user =  "root";
$pass = "";
$dbname = "prasarana1";
$port=4306;

$conn = mysqli_connect($hostname, $user, $pass, $dbname, $port)or die ("sorry could not connect to database");

// $conn = mysqli_connect("localhost", "root", "", "prasarana1", "4306");

//     if(mysqli_connect_errno()){
//         echo "Connection Fail".mysqli_connect_error();
//     }

?>