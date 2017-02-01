<?php
/**
 * Created by PhpStorm.
 * User: Lordinel
 * Date: 6/19/2016
 * Time: 11:24 AM
 */

// check if form is submitted
if(!isset($_FILES["new_product_photo"])) {
    $json['return_code'] = "error";
    echo json_encode($json);
    die();
}

// determine upload location of photo based on product type
switch($_POST['new_product_type']) {
    case "Shows":
        $uploadPath = "../images/shows/";
        break;
    case "Books":
        $uploadPath = "../images/books/";
        break;
    case "Games":
        $uploadPath = "../images/games/";
        break;
    case "Music":
        $uploadPath = "../images/music/";
        break;
    default:
        $uploadPath = "../images/";
}

// move photo to upload location
move_uploaded_file($_FILES["new_product_photo"]['tmp_name'], $uploadPath.$_FILES['new_product_photo']['name']);

// append new product to xml file
$xmlFile = "../db/catalog.xml";
$catalog = simplexml_load_file($xmlFile);
$product = $catalog->addChild('PRODUCT');
$product->addChild('NAME',$_POST['new_product_name']);
$product->addChild('PHOTO',$_FILES['new_product_photo']['name']);
$product->addChild('TYPE',$_POST['new_product_type']);

// format xml file and save
$dom = new DOMDocument("1.0");
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML($catalog->asXML());
$dom->save($xmlFile);

// return json status
$json['return_code'] = "success";
echo json_encode($json);
?>
