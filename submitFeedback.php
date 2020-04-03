<?php

if(isset($_POST['fullname'], $_POST['email'], $_POST['feedbackmessage'])) {
    //Post data
    $name = $_POST['fullname'];
    $email = $_POST['email'];
    $message = $_POST['feedbackmessage'];
    //mail settings
    $to = "sudiptomondal@pm.me";
    $subject = 'Retrowave Alpha :: Feedback/Report';
    $body = <<<EMAIL

My name is $name.

$message

My email is: $email
EMAIL;
    $header = "From:" . $email;

    if(mail($to, $subject, $body, $header)){
        $notify = '<i class="material-icons">done</i></button> Sent Thanks!';
    }else{
        $notify = '<i class="material-icons">error_outline</i></button> Failed! Try Again.';
    }
} else{
    $notify = 'Dude Wut!?';
}

echo $notify;

?>