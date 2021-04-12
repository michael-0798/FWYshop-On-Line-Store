<?php
function save_image_file() {
 
    //folder name for image files
    $target_dir = "images/";
    $target_file = $target_dir . basename($_FILES["imagefile"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    //check if image file is actuall image file or fake image
    if(isset($_FILES["imagefile"])) {
        $check = getimagesize($_FILES["imagefile"]["tmp_name"]);
        if($check != false) {
            $uploadOk = 1;
        }
    }

    //check if file alraedy exists
    if (file_exists($target_file)){
        $uploadOk = 0;
    }

    // allow certain image file formats
    if ($imageFileType != "jpg" && $imageFileType != "png" 
            && $imageFileType != "jpeg" && $imageFileType != "gif") {
                $uploadOk = 0;
    }

    if ($uploadOk == 1) {
        move_uploaded_file($_FILES["imagefile"]["tmp_name"], $target_file);
    }
}