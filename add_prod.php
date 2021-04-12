<?php
    require_once "file_upload.php";

    if(isset($_POST['submit'])) {

        // Function to upload file $_FILE to image folder
        save_image_file();

        //MySQL database connection info
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
        
        //SQL insert record to product table
        $sql = "INSERT INTO `product` (`pid`, `name`, `price`, `rating`, `brand`, `material`, `itemid`, 
                            `style`, `description`) VALUES ( '";
        $sql .= $_POST["pid"] . "','" ;
        $sql .= $_POST["name"] . "','" ;
        $sql .= $_POST["price"] . "','" ;
        $sql .= $_POST["rating"] . "','" ;
        $sql .= $_POST["brand"] . "','" ;
        $sql .= $_POST["material"] . "','" ;
        $sql .= $_POST["itemid"] . "','" ;
        $sql .= $_POST["style"] . "','" ;
        $sql .= $_POST["description"] . "')" ;
       
        if($conn->query($sql) === TRUE ) {
            echo "New product has been added to database successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
        //close db connection
        $conn->close();
    }
?>

<!DOCTYPE html>
<html>
    <head>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	    <script src="js/jquery-3.4.1.slim.min.js"></script>
	    <script src="js/bootstrap.min.js"></script>
          <style>
            #loading-img { display:none;}
            .response_msg {
                margin-top:10px;
                font-size:13px;
                background:#E5D669;
                color:#ffffff;
                width:250px;
                padding:3px;
                display:none;
            }
        </style>
    </head>
    <body>
    <div class="container">
        <div class="row">
            <div class="col-md-8">
                <h1>Add product to database</h1>
                <form name="contact-form" method="post" id="contact-form" enctype="multipart/form-data">
                
                    <div class="form-group">
                        <label for="pid">Image File</label>
                        <input type="file" accept="image/*" id="imagefile" name="imagefile">
                    </div>
                    <div class="form-group">
                        <label for="pid">Product ID</label>
                        <input type="text" class="form-control" name="pid" placeholder="pid" required>
                    </div>
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" name="name" placeholder="name" required>
                    </div>
                    <div class="form-group">
                        <label for="price">Price</label>
                        <input type="text" class="form-control" name="price" placeholder="price" required>
                    </div>
                    <div class="form-group">
                        <label for="rating">Rating</label>
                        <input type="text" class="form-control" name="rating" placeholder="rating" required>
                    </div>
                    <div class="form-group">
                        <label for="brand">Brand</label>
                        <input type="text" class="form-control" name="brand" placeholder="brand" required>
                    </div>
                    <div class="form-group">
                        <label for="material">Material</label>
                        <input type="text" class="form-control" name="material" placeholder="material" required>
                    </div>
                    <div class="form-group">
                        <label for="itemid">Item Serial Code</label>
                        <input type="text" class="form-control" name="itemid" placeholder="itemid" required>
                    </div>
                    <div class="form-group">
                        <label for="style">Style</label>
                        <input type="text" class="form-control" name="style" placeholder="style" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea name="description" class="form-control" rows="3" cols="28" rows="5" placeholder="description"></textarea> 
                    </div>
                    <button type="submit" class="btn btn-primary" name="submit" value="Submit" id="submit_form">Submit</button>
                </form>
                <div class="response_msg"></div>
            </div>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
</body>
</html>