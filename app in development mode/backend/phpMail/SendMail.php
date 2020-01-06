<?php
// Load Composer's autoloader
// Instantiation and passing `true` enables exceptions

// require './vendor/autoload.php';
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;
// header('Content-Type: text/plain');
// Import PHPMailer classes into the global namespace
// These must be at the top of your script, not inside a function
// $email = new SendEmail();
// $email->sendMail("emailMsg","emailSubject","it@unicarm.ro");

// $email->emailStaticSend( "testbody", "subiect","lucut_ovidiu@yahoo.com");
//$_POST = json_decode(file_get_contents('php://input'), true);
if(isset($_POST['type'])){   

    if($_POST['type'] ==="SesizareNouaEmail"){
        $email = new SendEmail();
        $emailMsg = $_POST['emailMsg'];
        $emailSubject = $_POST['emailSubject'];
        $emailToAddress =$_POST['emailToAddress'];
        // $email->emailStaticSend( "test", "subiect","lucut_ovidiu@yahoo.com");
        $email->emailStaticSend($emailMsg,$emailSubject,$emailToAddress);
        // echo "testoviiiiiiiiii";
    }
}
class SendEmail{

    function emailStaticSend($emailMsg,$emailSubject,$emailToAddress){
        $to_email = $emailToAddress;
        $subject = $emailSubject;
        $message = $emailMsg;
        $headersfrom='';
        $headersfrom .= 'MIME-Version: 1.0' . "\r\n";
        $headersfrom .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        $headersfrom .= 'From:  imprimante@unicarm.ro'. "\r\n";
        echo mail($to_email,$subject,$message,$headersfrom);
    }
//Aprilie2015 - g97
    function sendMail($emailMsg,$emailSubject,$emailToAddress){
    $mail = new PHPMailer(true);
        try {
            $mail = new PHPMailer;
    
            $mail->SMTPDebug = 2;                               // Enable verbose debug output
    
            $mail->isSMTP();                                      // Set mailer to use SMTP
            $mail->Host = 'mail.unicarm.ro';  // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                               // Enable SMTP authentication
            $mail->Username = 'imprimante@unicarm.ro';                 // SMTP username
            $mail->Password = 'Sit2010Unicarm';                           // SMTP password
            $mail->SMTPSecure =false;                            // Enable TLS encryption, `ssl` also accepted
            $mail->Port = 465;                                    // TCP port to connect to
            //Server settings
        
            //Recipients
            $mail->setFrom('imprimante@unicarm.ro', 'Sesizari Imprimante');
            $mail->addAddress($emailToAddress);     // Add a recipient
            //$mail->addAddress('ellen@example.com');               // Name is optional
        // $mail->addReplyTo('info@example.com', 'Information');
            //$mail->addCC('cc@example.com');
            //$mail->addBCC('bcc@example.com');
        
            // Attachments
            //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
            //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
        
            $HtmlBody='This is the HTML message body <b>in bold!</b>';
            // Content
            $mail->isHTML(true);                                  // Set email format to HTML
            $mail->Subject = $emailSubject;
            $mail->Body    = $emailMsg;
            $mail->AltBody = strip_tags($emailMsg);
        
            $mail->send();
            echo 'Message has been sent';
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    }
}

/*

    sendEmail = (configEmail) => {
        axios.post('imprimanteunicarm/backend/phpMail/SendMail.php', configEmail)
            .then((res) => {
                //console.log(res.data);
                try {
                    //const { response } = JSON.parse(res.data);
                    console.log("emailResponse: ", res);
                } catch (e) {
                    console.error(e);
                }
            });
    }

    configEmail = {
        emailMsg: "",
        emailSubject: "",
        emailToAddress: "lucut_ovidiu@yahoo.com"
    }

let emailMsg = `
        <br/><br/>
        &nbsp;&nbsp;&nbsp;<h3>Imprimanta venita din reparatie</h3>
        <br/><br/>
        <table width="auto" border="0" cellspacing="3" cellpadding="6" style="border:1px solid #ccc;">
           <tr ><th>Creat De</th>
           <td style="border-bottom:1px solid #ccc;">${reparatie.changed_by}</td>
           </tr>
           <tr ><th>Nume Magazin</th>
           <td style="border-bottom:1px solid #ccc;">${this.state.currentSelectedSesizare.store_name} - ${this.state.currentSelectedSesizare.store_location}</td>
           </tr>
           <tr><th>Printer Brand</th>
           <td style="border-bottom:1px solid #ccc;">${this.state.currentSelectedSesizare.printer_brand}</td>
           </tr>
           <tr><th>Printer Model</th>
           <td style="border-bottom:1px solid #ccc;">${this.state.currentSelectedSesizare.printer_model}</td>
           </tr>
           <tr><th>Fosta Problema</th>
           <td style="border-bottom:1px solid #ccc;">${this.state.currentSelectedSesizare.sesizari_log_problem} - ${this.state.currentSelectedSesizare.sesizari_log_problem_description}</td>
           </tr>
           <tr><th>Status Actual</th>
           <td style="border-bottom:1px solid #ccc;">${reparatie.printer_status}</td>
           </tr>   
           <tr><th>Piese Montate</th>
           <td style="border-bottom:1px solid #ccc;">${reparatie.repair_parts_fitted}</td>
           </tr>  
           <tr><th>Mai Multe Reparatii despre Reparatie</th>
           <td style="border-bottom:1px solid #ccc;">${reparatie.repair_info}</td>
           </tr>           
           <tr><th>Cost</th>
           <td>${reparatie.repair_cost}</td>
           </tr>           
        </table>
        <br/> <br/>
        Cu respect,<br/>&nbsp;&nbsp;&nbsp;&nbsp;Sesizari Imprimante Unicarm
        `;

    /// when to send
    this.configEmail = {
                            emailMsg: emailMsg,
                            emailSubject: "Reparatie Noua - " + this.state.currentSelectedSesizare.store_name,
                            emailToAddress: "lucut_ovidiu@yahoo.com",
                            type: "SesizareNouaEmail"
                        }
                        // console.log(this.configEmail);
                        this.sendEmail(this.configEmail);


*/