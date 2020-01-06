<?php
header('Content-Type: application/json');

$_POST = json_decode(file_get_contents('php://input'), true);

    if(isset($_POST['type'])){   
        if($_POST['type'] ==="Delete_General") {   

        $table_name = $_POST['table_name'];
        $deleteListIndexBy = $_POST['deleteListIndexBy'];      
        $toDeleteList = $_POST['toDeleteList'];      

        $update = new Updates();
        $update->delete_general($table_name,$deleteListIndexBy,$toDeleteList);
        $update = null;
        // //$response = json_encode('{"response":"'.$_POST['type'].'"}');
        //echo $response;
        }
        
    }else{
        $response = json_encode('{"response":"failed to update"}');
        echo $response;
    }


    //echo "$username : $password";
    //echo date('d-m-Y H:i:s');
    //$auth = new Auth();
    //echo $auth->check_auth($username,$password);

    class Updates{
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
            $res = json_encode('{"response":"'.$err.'"}');
            echo $res;
        }
    }
    function closeConection(){
        $this->conn->close();
    }
    
    function delete_general($table_name,$deleteListIndexBy,$toDeleteList){
        $this->getConnection();

        $result="";
        foreach($toDeleteList as $item){
        $sql = "delete from $table_name where $deleteListIndexBy='$item'";
        $result = $this->conn->query($sql);  
        }
        if($result ===true ) $result="ok";
        $res = json_encode('{"response":"'.$result.'"}');
        echo $res;
        
        $this->closeConection();
    }

    
    }
?>