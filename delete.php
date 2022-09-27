<?php

session_start();

include("config.php");

$idDelete = $_GET['idDelete'];


$f1 = "DELETE FROM train WHERE id=$idDelete";
$f2 = mysqli_query($conn,$f1) or die(mysqli_error());

$_SESSION['delete'] = "Item has been deleted";
header("location: AMGL.php");
?>  