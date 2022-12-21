<!DOCTYPE html>
<html>
  <head>
    <title>Rapid Rail</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
  </head>
  <body>
  <style>
body, html {
  height: 100%;
  font-family: Arial, Helvetica, sans-serif;
}

.navbar {
  overflow: hidden;
  background-color: #333;
}

.navbar a {
  float: left;
  font-size: 16px;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

.dropdown {
  float: left;
  overflow: hidden;
}

.dropdown .dropbtn {
  font-size: 16px;  
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}

.navbar a:hover, .dropdown:hover .dropbtn {
  background-color: red;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}
    
    .bg {
      /* The image used */
      background-image: url("meric-dagli-HxJvFZGfSHM-unsplash.jpg");
      
      /* Full height */
      height: 100%;
      
      /* Center and scale the image nicely */
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
    </style>


    <!-- Navbar (sit on top) -->
    <div class="navbar">
  <a href="login.php">Login</a>
  <a href="#news">About</a>
  <div class="dropdown">
    <button class="dropbtn">Rail 
      <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-content">
      <a href="AmgL.php">Ampang Line</a>
      <a href="#">Ampang Depot</a>
      <a href="#">KKSB Depot</a>
    </div>
  </div> 
</div>

    <div class="bg">
      <div>
        <img
          src="./1280px-Rapid_KL_Logo.svg.png"
          style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 50%;
          "
        />
      </div>
    </div>
  </form>
  </body>
</html>
