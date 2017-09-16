<?php
	$servername = "mysql.cs.mun.ca";
	$username = "cs3715w17_jph432";
	$password = "fGSVXRxF";
	$dbName = "cs3715w17_jph432";
	
	// Create connection
	$conn = mysqli_connect($servername, $username, $password, $dbName);
	
	// Check connection
	if (!$conn) {
	    die("Connection failed: " . mysqli_connect_error());
	}
	
	if ($_GET['mode'] == "'1 Player'") {
		$mode = "single";
	}
	else {
		$mode = "double";
	}
	
	$sql = "SELECT Username, Score FROM Highscores WHERE Game = '".$mode."' AND Speed = ".$_GET['speed'].";";
	$result = mysqli_query($conn, $sql);
	$users = array();
	$scores = array();

	if (mysqli_num_rows($result) > 0) {
  	  	$i = 0;
  	  	while($row = mysqli_fetch_assoc($result)) { //put results into 2 arrays, return through ajax
   	  		$users[$i] = $row["Username"];
   	  		$scores[$i] = $row["Score"];
   	  		echo $users[$i].":".$scores[$i].", ";
   	  		$i++;
    	}
	}
	mysqli_close($conn);
?>
