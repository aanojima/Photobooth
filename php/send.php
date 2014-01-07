<?php

if (isset($_POST["image"]) && isset($_POST["address"]) && !empty($_POST["image"]) && !empty($_POST["address"])){

	$dataURL = $_POST["image"];
	$email = $_POST["address"];

	$parts = explode(",", $dataURL);
	$data = $parts[1];

	$data = base64_decode($data);

	$file = 'TF-Photobooth-'.uniqid().'.png';

	$success = file_put_contents($file, $data);

	// TODO: Email Attachments
	mail($email, "[Techfair Photobooth]", "Here is your photo (coming later...)", "From:noreply-tf-photobooth@mit.edu");

	echo $success ? $file : "Unable to save this image. ";
}

?>