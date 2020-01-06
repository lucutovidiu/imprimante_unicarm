<?php
header('Content-Type: application/json');

$_POST = json_decode(file_get_contents('php://input'), true);
    $username = $_POST['username'];
    $password = $_POST['password'];
    //echo "$username : $password";
    //echo date('d-m-Y H:i:s');
    $auth = new Auth();
    echo $auth->check_auth($username,$password);

    class Auth{
    public $servername = "localhost";
    public $username = "root";
    public $password = "";
    public $dbname = "db_imprimante";
    public $conn;

    function getConnection(){
        // Create connection
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
        // Check connection
        if ($this->conn->connect_error) {
            $err="Error: connection failed: " . $this->conn->connect_error;
            //die($err. "<br>");
            echo $err;
        }
    }
    function closeConection(){
        $this->conn->close();
    }

    function check_auth($username, $password){
        $this->getConnection();
        $username=trim(strtoupper ($username));
        $sql ="select user_password,user_role from printer_users where user_name='$username'";
        $result = $this->conn->query($sql);        
        $row = $result->fetch_assoc();
        if(isset($row["user_password"])){
            $passwordSql = $row["user_password"];
            if(trim(strtoupper ($password)) === trim(strtoupper ($passwordSql))){
                $role = $row["user_role"];
                $token =$this->getToken(20);
                date_default_timezone_set("Europe/Bucharest");
                $date = date('Y-m-d H:i:s');
                $sql="update printer_users set user_token='$token',user_last_login='$date' where user_name='$username'";
                $this->conn->query($sql); 
                return json_encode('{"auth":"ok","token":"'.$token.'","role":"'.$role.'"}');
            }else 
                return json_encode('{"auth":"failed"}');
        }else 
        return json_encode('{"auth":"failed"}');
    
        $this->closeConection();
    }

    function getToken($length)
{
    $token = "";
    $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
    $codeAlphabet.= "0123456789";
    $max = strlen($codeAlphabet); // edited

    for ($i=0; $i < $length; $i++) {
        $token .= $codeAlphabet[rand(0, $max-1)];
    }

    return $token;
}

    }
?>