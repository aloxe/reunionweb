<?php
$json = json_decode(file_get_contents("php://input"));

if (isset($json->name))
    $name = stripcslashes($json->name);
if (isset($json->email))
    $email = stripcslashes($json->email);
if (isset($json->message))
    $message = stripcslashes($json->message);

if (isset($_SERVER['REMOTE_ADDR']))
    $ip	= $_SERVER['REMOTE_ADDR'];

function encode_mail_header( $in_str, $charset ) {
    $out_str = $in_str;

    if ($out_str && $charset) {

        // define start delimimter, end delimiter and spacer
        $end = "?=";
        $start = "=?" . $charset . "?B?";
        $spacer = $end . "\r\n " . $start;

        // determine length of encoded text within chunks
        // and ensure length is even
        $length = 75 - strlen($start) - strlen($end);
        $length = floor($length/4) * 4;

        // encode the string and split it into chunks
        // with spacers after each chunk
        $out_str = base64_encode($out_str);
        $out_str = chunk_split($out_str, $length, $spacer);

        // remove trailing spacer and
        // add start and end delimiters
        $spacer = preg_quote($spacer);
        $out_str = preg_replace("/" . $spacer . "$/", "", $out_str);
        $out_str = $start . $out_str . $end;
    }
    return $out_str;
}

// Here we get all the information from the fields sent over by the form.
$name = iconv("ISO-8859-1","ISO-8859-15",$name);
$headname = encode_mail_header("$name", "iso-8859-1");
include "../../homes/mailto.php"; // $to =

if ($name == "404") {
  $subject = "[reunionweb.org] Page $name";
} else {
  $subject = "[reunionweb.org] message from $name";
}
$message = "FROM: $name\r\n Email: $email\r\n Message: $message";

$header = "From: $headname <$email>\r\n";
$header .= "Reply-To: $headname <$email>\r\n";
$header .= "MIME-Version: 1.0\r\n";
$header .= "Content-Type: text/plain; charset=utf-8\r\n";
$header .= "User-Agent: PHP envoi\r\n";
$header .= "X-ClientIP: $ip \r\n";

if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    mail($to,$subject,$message,$header) or die('Error sending Mail');
    $data = array('status' => 201, 'message' => 'Email envoyé');
} else {
    $data = array('status' => "0", 'message' => 'NOPE pas envoyé');
}
echo json_encode($data);
?>
