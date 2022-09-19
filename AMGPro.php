<?php 
    include("config.php");

    if (isset($_POST ['btnSubmit'])) {
        //retrive all entered data
        $train_id = $_POST['train_id'];

        $sql = "INSERT INTO train (train_id) VALUES('$train_id')";

        if(mysqli_query($conn,$sql)){
            echo "<script>alert('Train ID not created')</script>";
            header("Location: amgline.php");
        }


    }

    


?>