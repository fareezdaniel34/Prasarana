<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Ampang Line</title>
    <style>
        body,
        html {
            height: 100%;
            margin: 0;
        }

        .drag {
            display: none;
            z-index: 100px;
            float: left;
            position: relative;
            cursor: all-scroll;
            width: 50px;
            height: 20px;
            background: aqua;
            text-align: center;
            margin: 5px;
        }

        .bg {
            /* The image used */
            background-image: url("3.png");

            /* Full height */
            height: 100%;

            /* Center and scale the image nicely */
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
        }

        #menu__toggle {
            opacity: 0;
        }

        #menu__toggle:checked+.menu__btn>span {
            transform: rotate(45deg);
            
        }

        #menu__toggle:checked+.menu__btn>span::before {
            top: 0;
            transform: rotate(0deg);

        }

        #menu__toggle:checked+.menu__btn>span::after {
            top: 0;
            transform: rotate(90deg);
        }

        #menu__toggle:checked~.menu__box {
            left: 0 !important;
        }

        #bg {
            position: fixed;
            top: 0;
            left: 0;

            /* Preserve aspet ratio */
            min-width: 100%;
            min-height: 100%;
        }

        .menu__btn {
            position: fixed;
            top: 20px;
            left: 20px;
            width: 26px;
            height: 26px;
            cursor: pointer;
            z-index: 120 !important;
        }

        .menu__btn>span,
        .menu__btn>span::before,
        .menu__btn>span::after {
            display: block;
            position: absolute;
            width: 100%;
            height: 2px;
            background-color: black;
            transition-duration: 0.25s;

        }

        .menu__btn>span::before {
            content: "";
            top: -8px;
        }

        .menu__btn>span::after {
            content: "";
            top: 8px;
        }

        .menu__box {
            display: block;
            position: fixed;
            z-index: 100 !important;
            top: 0;
            left: -100%;
            width: 300px;
            height: 100%;
            margin: 0;
            padding: 80px 0;
            list-style: none;
            background-color: #eceff1;
            box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
            transition-duration: 0.25s;
        }

        .menu__item {
            display: block;
            padding: 12px 24px;
            color: #333;
            font-family: "Roboto", sans-serif;
            font-size: 20px;
            font-weight: 600;
            text-decoration: none;
            transition-duration: 0.25s;
        }

        .menu__item:hover {
            background-color: #cfd8dc;
        }

        #divh {
            display: none;
            background: white;
            height: 100px;
            width: 200px;
            margin: 0 auto;
            color: white;
        }

        .button1 {
            background-color: #4CAF50;
            /* Green */
            border: none;
            color: white;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            padding: 10px 24px;
        }


        .dropbtn {
            background-color: #54bab9;
            color: white;
            padding: 4px;
            border: none;
            cursor: pointer;
        }

        /* The container <div> - needed to position the dropdown content */
        .dropdown {
            position: relative;
            display: inline-block;
        }

        /* Dropdown Content (Hidden by Default) */
        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f9f9f9;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            z-index: 1;
        }

        /* Links inside the dropdown */
        .dropdown-content a {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
        }

        /* Change color of dropdown links on hover */
        .dropdown-content a:hover {
            background-color: #f1f1f1;
        }

        /* Show the dropdown menu on hover */
        .dropdown:hover .dropdown-content {
            display: block;
        }

        /* Change the background color of the dropdown button when the dropdown content is shown */
        .dropdown:hover .dropbtn {
            background-color: #54bab9;
        }

        .drag-container {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .add-train-container {
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    </style>

</head>

<body>
    <div class="bg">
        <div class="hamburger-menu">
            <input id="menu__toggle" type="checkbox" />
            <label class="menu__btn" for="menu__toggle">
                <span></span>
            </label>

            <div class="menu__box">
                <div><a class="menu__item" href="index.php">Home</a></div>
                <div><a class="menu__item" href="AMGL2.php">Ampang Line</a></div>
                <div><a class="menu__item" href="index.php">KKSB Depot</a></div>
                <div><a class="menu__item" href="index.php">Ampang Depot</a></div>
                <div class="add-train-container">
                    <select id="select-train" name="train">
                        <option value="TR01">TR01</option>
                        <option value="TR02">TR02</option>
                        <option value="TR03">TR03</option>
                        <option value="TR04">TR04</option>
                        <option value="TR05">TR05</option>
                        <option value="TR06">TR06</option>
                        <option value="TR07">TR07</option>
                        <option value="TR08">TR08</option>
                        <option value="TR09">TR09</option>
                        <option value="TR10">TR10</option>
                        <option value="TR11">TR11</option>
                        <option value="TR12">TR12</option>
                        <option value="TR13">TR13</option>
                        <option value="TR14">TR14</option>
                        <option value="TR15">TR15</option>
                    </select>
                    <button class="w3-button w3-teal btn btn-primary" data-toggle="modal" data-target="#myModal" onclick="addTrain()">Add Train</button>
                </div><br>
                <div><input type="button" class="button1" style="margin: auto; display: grid;" value="Toggle Fullscreen" onclick="document.documentElement.requestFullscreen()" /></div>
                <br>
                <div>
                    <button class="button1" id="SectionName" style="margin: auto; display: grid;" onclick="myFunction()">Clear</button>
                </div><br>

                <div><input type="button" class="button1" value="Exit Fullscreen" style="margin: auto; display: grid;" onclick="document.exitFullscreen();" /></div><br>
                <script type="text/javascript" src="https://cdn.rawgit.com/asvd/dragscroll/master/dragscroll.js">
                </script>


            </div>

        </div>
        <div class="drag-container">
            <div class='drag'>TR01</div>
            <div class='drag'>TR02</div>
            <div class='drag'>TR03</div>
            <div class='drag'>TR04</div>
            <div class='drag'>TR05</div>
            <div class='drag'>TR06</div>
            <div class='drag'>TR07</div>
            <div class='drag'>TR08</div>
            <div class='drag'>TR09</div>
            <div class='drag'>TR10</div>
            <div class='drag'>TR11</div>
            <div class='drag'>TR12</div>
            <div class='drag'>TR13</div>
            <div class='drag'>TR14</div>
            <div class='drag'>TR15</div>
        </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js" type="text/javascript"></script>

        <script>
            $('.drag').draggable();
        </script>
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
        <script>

        
function myFunction() {

  console.log('object');
  var train = document.getElementsByClassName("drag");

  for (let i = 0; i < train.length; i++) {
    train[i].style.display = 'none';
  }
//   if (x.style.display === "none") {
//     x.style.display = "block";
//   } else {
//     x.style.display = "none";
//   }
}

const addTrain = () => {
    const selectedTrain = document.getElementById("select-train").value;
    var train = document.getElementsByClassName("drag");

    for (let i = 0; i < train.length; i++) {
        // console.log(selectedTrain);
        // console.log(train[i].innerHTML);q
        if (train[i].innerHTML == selectedTrain) {
            train[i].style.display = 'block';
        }
    }
}
</script>
</body>

</html>