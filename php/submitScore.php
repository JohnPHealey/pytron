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
	
	if ($_POST["game"] == 1) {
		$mode = "single";
	}
	else {
		$mode = "double";
	}
	
	$sql = "INSERT INTO Highscores VALUES ('".$_POST["username"]."', ".$_POST["score"].", '".$mode."', '".$_POST["speed"]."')";

	if (mysqli_query($conn, $sql)) {
		//redirect back to main menu to show leaderboard
 	   	header("Location: main.php?score=".$_POST["score"]."&user=".$_POST["username"]."&speed=".$_POST["speed"]."&game=".$_POST["game"]);
	} else {
  		echo "Error: " . $sql . "<br>" . mysqli_error($conn);
	}

	mysqli_close($conn);
	
?>
