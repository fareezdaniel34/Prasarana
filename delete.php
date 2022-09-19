<?php

session_start();

include("config.php");

$idDelete = $_GET['idDelete'];


$truncatetable= mysql_query("TRUNCATE TABLE train");

if($truncatetable !== FALSE)
{
   echo("All rows have been deleted.");
}
else
{
   echo("No rows have been deleted.");
}

?>  