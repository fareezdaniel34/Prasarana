<?php
session_start();
error_reporting(0);
include('./config.php');

$selectUser = "select * from train ";
$q2 = mysqli_query($conn, $selectUser) or die ("no data".mysqli_error($conn));


    if($_GET['idEdit'] != "") {
        $title = "Update";
        $button = "Update";
    } else {
        $title = "Register Product";
        $button = "Register Train";
    }



?>

<!DOCTYPE HTML>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="AMGline.css">
  <script type="text/Javascript" src="train.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js"></script>
  <title>Ampang Line</title>
</head>


<body style="background-color:#545454; width: 100px; height: 100%;">

<form method="POST" action="AMGPro.php">

  <script src="train.js"></script>
  <!-- Navbar (sit on top) -->
  
  <div class="hamburger-menu">
    <input id="menu__toggle" type="checkbox" />
    <label class="menu__btn" for="menu__toggle">
      <span></span>
    </label>

    <div class="menu__box">
      <div><a class="menu__item" href="index.php">Home</a></div>
      <div><button class="w3-button w3-teal btn btn-primary" data-toggle="modal" data-target="#myModal" style="margin: auto; display: grid;">Add Train</button></div><br>
      <div><input type="button" class="button1" style="margin: auto; display: grid;" value="Toggle Fullscreen" onclick="document.documentElement.requestFullscreen()" /></div>
      <br>
      <div>
        <button class="button1" id="idDelete" style="margin: auto; display: grid;">Clear</button>
      </div><br>

      <div><input type="button" class="button1" value="Exit Fullscreen" style="margin: auto; display: grid;" onclick="document.exitFullscreen();" /></div><br>
      <script type="text/javascript" src="https://cdn.rawgit.com/asvd/dragscroll/master/dragscroll.js"></script>

    </div>
  </div>
  
  <main class="grid-item main">
  
  
    <div id="mydiv">
        <?php 
          while($q3 = mysqli_fetch_array($q2, MYSQLI_ASSOC)) {
              extract($q3);
          ?>
      <!-- Include a header DIV with the same name as the draggable DIV, followed by "header" -->
      <!-- <div id="mydivheader"></div> -->
      <div class="dropdown">
        <div class="btn-group">
        <button id="SectionName" style="display:none; font-weight: bold; font-size: x-small; background-color: #54bab9;"><</button>

        <button onclick="myFunction()" id="train_id" class="dropbtn" style="font-weight: bold; max-height: 10px; max-width:80px; font-size: x-small;"><?php echo $train_id?></button>
        <button id="SectionNames" style="display:none; font-weight: bold; font-size: x-small; background-color: #54bab9;">></button>
      </div>
        <div id="myDropdown" class="dropdown-content">
          <a class="triangle-left"onclick="ShowAndHide()">Left</a>
          <a onclick="ShowAndHides()">Right</a>
          <a onclick="location.href='delete.php?idDelete=<?php echo $id ?>'" value="Delete">Delete</a>
        </div>
      </div>
    </div>
    <?php } ?>

    
    
    <script>
function ShowAndHide() {
    var x = document.getElementById('SectionName');
    if (x.style.display == 'none') {
        x.style.display = 'inline-block';
    } else {
        x.style.display = 'none';
    }
}
function ShowAndHides() {
    var x = document.getElementById('SectionNames');
    if (x.style.display == 'none') {
        x.style.display = 'inline-block';
    } else {
        x.style.display = 'none';
    }
}
</script>
<div class="modal" id="myModal">
  <div class="modal-dialog">
    <div class="modal-content">

      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title">Add Train</h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>

      <!-- Modal body -->
      <!-- input add train to database -->
      <form method="POST" action="AMGPro.php">
      <section class="input-container">
          <!-- <input type="hidden" name="train_id"> -->
          <div class="modal-body">
            <div style="margin:auto; display:grid;">
            
              Add Train Name:<input type="text" name="train_id" placeholder="Enter train name" required>
              <input type="submit" name="btnSubmit"></input>
            </div>
      </section>
        
        
      </div>

      <!-- <section class="button-section">
                
            </section> -->
      <!-- Modal footer -->
      </form>

    </div>
  </div>
</div>

      
  </script>

  <!-- <div id="mydiv3">
    <div id="mydivheader"></div>
    <div class="dropdown">
      <button class="dropbtn" id="button"
        style="font-size:8px; background-color: aqua; color: black; font-weight: bold;">TR01</button>
      <div class="dropdown-content">
        <a href='#'>Left</a>
        <a href="#">Right</a>
        <a href="#">Edit</a>
      </div>
    </div>
  </div> -->





  <div>
    <button type="button" onclick="capture()"
      style="position: fixed; right: 20px; bottom: 580px; border-radius: 100px;">
      <img src="ss.png" style="padding: 5px;">
    </button>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.4/html2canvas.min.js"></script>
  <script>
    function capture() {
      html2canvas(document.body).then((canvas) => {
        let a = document.createElement("a");
        a.download = "ss.png";
        a.href = canvas.toDataURL("image/png");
        a.click();
      });
    }
  </script>
  </div>

  <div><button type="button" style="position: fixed; right: 20px; bottom: 630px; border-radius: 100px;"
      onclick="zoomin()">
      <img src="in.png" style="padding: 5px;">

    </button>
  </div>

  <div><button type="button" style="position: fixed; right: 20px; bottom: 530px; border-radius: 100px;"
      onclick="zoomout()">
      <img src="out.png" style="padding: 5px;">

    </button> </div>


   


  <script src="https://code.jquery.com/jquery-1.12.4.min.js">

  </script>
  <div style="text-align:center; background-color: #545454; height: 100%; width:100%;">
    <div class="box">
      <script type="text/javascript" src="https://cdn.rawgit.com/asvd/dragscroll/master/dragscroll.js"></script>
      <div class="dragscroll" style="width:1920px; height: 1080px; overflow: scroll; cursor: grab; cursor : -o-grab; cursor : -moz-grab; cursor : -webkit-grab;">
      <img src="amgmap1.png"id="geeks" GFG="250" alt="Geeksforgeeks">
</div>

    </div>


    <hr>




    <script>
      let toggle = () => {
    
        let element = document.getElementById("button");
        let hidden = element.getAttribute("hidden");
    
        if (hidden) {
           element.removeAttribute("hidden");
        } else {
           element.setAttribute("hidden", "hidden");
        }
      }
    </script>


    <script type="text/javascript">

      function zoomin() {

        var GFG = document.getElementById("geeks");

        var currHeight = GFG.clientHeight;

        GFG.style.height = (currHeight + 40) + "px";

      }

      function zoomout() {

        var GFG = document.getElementById("geeks");

        var currHeight = GFG.clientHeight;

        GFG.style.height = (currHeight - 40) + "px";

      }

    </script>
      <script>
        //Make the DIV element draggagle:
        dragElement(document.getElementById("mydiv"));
        
        function dragElement(elmnt) {
          var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
          if (document.getElementById(elmnt.id + "header")) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
          } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
          }
        
          function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
          }
        
          function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
          }
        
          function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
          }
        }
        </script>
        
        <script>
          /* When the user clicks on the button, 
          toggle between hiding and showing the dropdown content */
          function myFunction() {
            document.getElementById("myDropdown").classList.toggle("show");
          }
          
          // Close the dropdown if the user clicks outside of it
          window.onclick = function(event) {
            if (!event.target.matches('.dropbtn')) {
              var dropdowns = document.getElementsByClassName("dropdown-content");
              var i;
              for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                  openDropdown.classList.remove('show');
                }
              }
            }
          }
          </script>
    

    <script src="train.js"></script>



  </div>
  </main>
</body>

</html>