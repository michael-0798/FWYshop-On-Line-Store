<?php
//MySQL database info
$servername = "localhost";
$username = "cst8285";
$password = "password";
$dbname = "cst8285";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

//SQL query, select all from product table
$sql = "SELECT * FROM product";
$result = $conn->query($sql);
$ret = [];
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    $ret[] =  $row;
  }
}
//close db connection
$conn->close();

echo json_encode(['status' => true, 'rows' => $ret]);