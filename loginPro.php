<?php

include("config.php");

$user = $_POST['username'];
$pass = $_POST['pass'];

$user_real = mysqli_real_escape_string($conn,$user);
$pass_real = mysqli_real_escape_string($conn,$pass);

$r1 = "select * from user where username='$user_real' and password='$pass_real'";
$r2 = mysqli_query($conn,$r1) or die(mysqli_error());
$r3 = mysqli_num_rows($r2);

while($res = mysqli_fetch_array($r2,MYSQLI_ASSOC))
{
    extract($res);
}

if($r3>0)
{
    header("location:AMGLine.php");
}
else{
    header("location:index.php?err=invalid");
}
?>