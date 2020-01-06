<?php
header('Content-Type: application/json');

$_POST = json_decode(file_get_contents('php://input'), true);

    if(isset($_POST['type'])){   
        if($_POST['type'] ==="NEW_STORE") {   
        $store_name = $_POST['payload']['nume_magazin'];
        $store_location = $_POST['payload']['locatie_magazin'];        
        $update = new Updates();
        $update->addNewStore($store_name,$store_location);
        $update = null;
        //$response = json_encode('{"response":"'.$_POST['type'].'"}');
        //echo $response;
        }
        if($_POST['type'] ==="NEW_PRINTER"){
            $update = new Updates();
            $printer_brand=$_POST['payload']['printer_brand'];
            $printer_model=$_POST['payload']['printer_model'];
            $printer_sn=$_POST['payload']['printer_sn'];
            $store_id_name=$_POST['payload']['store_id_name'];
            $printer_status=$_POST['payload']['printer_status'];
            $printer_list_price=$_POST['payload']['printer_list_price'];
            $printer_installed_date=$_POST['payload']['printer_installed_date'];            
            $changed_by=$_POST['payload']['changed_by'];

            $date = new DateTime($printer_installed_date);
            $printer_installed_date=$date->format('Y-m-d');
            $update->addNewPrinter($printer_brand,$printer_model,$printer_sn,
            $store_id_name,$printer_status,$printer_list_price,$printer_installed_date);
            $update->addNewPrinterToHistory($printer_sn,$store_id_name,$printer_status,$changed_by);
            $update = null;
        }
        if($_POST['type'] ==="IntroducereReparatie"){
            $update = new Updates();
            //fields for table printers_repairs_log
            $repair_date=$_POST['repair_date'];//1
            $repair_counter=$_POST['repair_counter']; //2
            $repair_parts_fitted=$_POST['repair_parts_fitted']; //3
            $repair_cost=$_POST['repair_cost']; //4
            $repair_info=$_POST['repair_info']; //5
            $sesizari_log_id=$_POST['sesizari_log_id']; //6
            $printer_id=$_POST['printer_id']; //7
            $store_id=$_POST['store_id'];//8            

            // fields for printers_history
            $printers_history_date=$_POST['printers_history_date'];
            $printers_history_notes="Imprimanta a fost reparata pe data de: $repair_date, cu numarul de sesizare: $sesizari_log_id";
            $changed_by=$_POST['changed_by'];
            //store_id, printer_id
            
            //update printers with location G29 - Vetis, required fields + serie de la generic
            //printer_id , status de obicei - "Utilizabila - in asteptare de nou utilizator"
            $printer_status=$_POST['printer_status'];   
            $printer_sn = $_POST['printer_sn'];         

            //update status sesizari cu inactive
            //mai e nevoie de sesizari_log_id
            $status_sesizare="inactive";
            $update->Introducere_Reparatie($repair_date,$repair_counter,$repair_parts_fitted,$repair_cost,
            $repair_info,$sesizari_log_id,$printer_id,$store_id,$printers_history_date,
            $printers_history_notes,$changed_by,$printer_status,$printer_sn);
            
            $update = null;
        }
        if($_POST['type'] ==="Adauga_Sesizare_In_Sistem_cu_serie_imprimanta_existenta"){
            $update = new Updates();

            date_default_timezone_set("Europe/Bucharest");
            $date = date('Y-m-d H:i:s');     

            $store_id=$_POST['store_id']; //2
            $printer_id=$_POST['printer_id']; //6
            $sesizari_log_problem=$_POST['sesizari_log_problem']; //4
            $sesizari_log_problem_description=$_POST['sesizari_log_problem_description']; //3
            $sesizari_log_date = $date; //1
            $status_sesizare = "active"; //5
            $changed_by = $_POST['changed_by']; //5

            $update->Adauga_Sesizare_In_Sistem_cu_serie_imprimanta_existenta($sesizari_log_date,$store_id,$sesizari_log_problem_description,
            $sesizari_log_problem,$status_sesizare,$printer_id,$changed_by);
            $update = null;
        }
        if($_POST['type'] ==="Adauga_Sesizare_In_Sistem_fara_serie_imprimanta"){
            $update = new Updates();

            date_default_timezone_set("Europe/Bucharest");
            $date = date('Y-m-d H:i:s');     

            
            $new_printer_sn=$_POST['new_printer_sn']; //6
            $printer_brand=$_POST['printer_brand']; //6
            $printer_model=$_POST['printer_model']; //6

            $store_id=$_POST['store_id']; //2
            $sesizari_log_problem=$_POST['sesizari_log_problem']; //4
            $sesizari_log_problem_description=$_POST['sesizari_log_problem_description']; //3
            $sesizari_log_date = $date; //1
            $status_sesizare = "active"; //5
            $changed_by = $_POST['changed_by']; //5

            $update->Adauga_Sesizare_In_Sistem_fara_serie_imprimanta($new_printer_sn,$printer_brand,$printer_model,$store_id,$sesizari_log_problem,
            $sesizari_log_problem_description,$sesizari_log_date,$status_sesizare,$changed_by);
            $update = null;
        }

        if($_POST['type'] ==="NEW_USER"){
            $update = new Updates();
            $user_name = $_POST['payload']['user_name'];
            $user_password= $_POST['payload']['user_password'];
            $user_role=$_POST['payload']['user_role'];
            $update->addNewUser($user_name, $user_password,$user_role);
            $update = null;
        }

        if($_POST['type'] ==="UPDATE_GENERAL"){
            $update = new Updates();
            $sql = $_POST['sqlCommand'];
            $update->updateGeneral($sql);
            $update = null;
        }
        if($_POST['type'] ==="STORE_USER_STATUS_CHANGE"){
            $update = new Updates();
            //echo var_dump($_POST);
            $storeChanges = $_POST['storeChanges'];
            $update->updatePrintersHistory($storeChanges);
            $update = null;
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
    
    function addNewStore($store_name,$store_location){
        $this->getConnection();
        $sql = "insert into store_info (store_name, store_location) values ('$store_name','$store_location')";
        $result = $this->conn->query($sql);  
        $result = trim(preg_replace('/[\t\n\r]+/', ' ', $result));
        $res = json_encode('{"response":"'.$result.'"}');
        echo $res;
        $this->closeConection();
    }

    function getIDByStoreName($store_id_name){
        $sql = "select store_id from store_info where store_name='$store_id_name'";
        $result = $this->conn->query($sql);
        $store_id=0;  
        if($row = $result->fetch_assoc())
            $store_id = $row['store_id'];

        return $store_id;            
    }

    function getStoreNameByID($store_id){
        $sql = "select store_name from store_info where store_id='$store_id'";
        $result = $this->conn->query($sql);
        $store_name="";  
        if($row = $result->fetch_assoc())
            $store_name = $row['store_name'];

        return $store_name;            
    }

    function addNewPrinter($printer_brand,$printer_model,$printer_sn,
    $store_id_name,$printer_status,$printer_list_price,$printer_installed_date){
        $this->getConnection();
        $store_id = $this->getIDByStoreName($store_id_name);
        $sql = "insert into printers (printer_brand, printer_model,printer_sn,store_id,printer_status,printer_list_price,printer_installed_date)".
        " values ('$printer_brand','$printer_model','$printer_sn','$store_id','$printer_status','$printer_list_price','$printer_installed_date')";
        $result = $this->conn->query($sql);  
        $result = trim(preg_replace('/[\t\n\r]+/', ' ', $result));
        $res = json_encode('{"response":"'.$result.'"}');
        echo $res;
        $this->closeConection();
    } 

    function Introducere_Reparatie($repair_date,$repair_counter,$repair_parts_fitted,$repair_cost,
    $repair_info,$sesizari_log_id,$printer_id,$store_id,$printers_history_date,
    $printers_history_notes,$changed_by,$printer_status,$printer_sn){
        $this->getConnection();
        //fields for table printers_repairs_log intoducere reparatie
        $result="";
        //
        $sql="insert into printers_repairs_log (repair_date,repair_counter,".
        "repair_parts_fitted,repair_cost,repair_info,sesizari_log_id,printer_id,store_id)".     
        "values ('$repair_date','$repair_counter','$repair_parts_fitted','$repair_cost','$repair_info'".
        ",'$sesizari_log_id','$printer_id','$store_id')";
        $result .='printers_repairs_log <$'. $this->conn->query(trim($sql)).'$>'; 
        // fields for printers_history
        $store_id = $this->getIDByStoreName("Sediu");
        $sql="insert into printers_history (printers_history_date,printers_history_notes,".
        "changed_by,printer_id,store_id)".
        "values ('$printers_history_date','$printers_history_notes',".
        "'$changed_by','$printer_id','$store_id')";
        $result .='printers_history <$'. $this->conn->query(trim($sql)).'$>';
        // //update printers with location G29 - Vetis, required fields
        // //printer_id , status de obicei - 'Utilizabila - in asteptare de nou utilizator'
        if($printer_sn!=="undefined"){
            $sql="update printers set printer_status='$printer_status',printer_sn='$printer_sn',".
            "store_id=(SELECT store_id from store_info where store_name='Sediu')".
            "where printer_id='$printer_id'";
            $result .='printers <$'. $this->conn->query(trim($sql)).'$>';
        }else{
            $sql="update printers set printer_status='$printer_status',".
            "store_id=(SELECT store_id from store_info where store_name='Sediu')".
            "where printer_id='$printer_id'";
            $result .='printers <$'. $this->conn->query(trim($sql)).'$>';
        }
         // //update status printers_sesizari cu inactive
        // //mai e nevoie de sesizari_log_id
        $sql="update printers_sesizari set status_sesizare='inactive' where sesizari_log_id='$sesizari_log_id'"; 

        $result .='printers_sesizari <$'. $this->conn->query(trim($sql)).'$>';
        $result = trim(preg_replace('/[\t\n\r]+/', ' ', $result));
        if($result!==""){
            $res = json_encode('{"response":"Record Updated - '.$result.' "}');
        }
        else{
            $res = json_encode('{"response":"Record Problem - '.$result.'"}');
        }
        echo $res;
        $this->closeConection();
    }
    function Adauga_Sesizare_In_Sistem_cu_serie_imprimanta_existenta($sesizari_log_date,$store_id,$sesizari_log_problem_description,
    $sesizari_log_problem,$status_sesizare,$printer_id,$changed_by){
        $this->getConnection();
        //adaugare in baza de date a logurilor la imprimante
        //$printer_sn=$this->getPrinterSNByID($store_id);
        $result="";
        $printer_status="Trimisa de la Magazin";
        $store_id_name = $this->getStoreNameByID($store_id);
        $printers_history_notes = "Imprimanta a avut sesizare de la magazinul: <$store_id_name> cu statusul: <$printer_status> problema: <$sesizari_log_problem> - $sesizari_log_problem_description";//2

        
        $sql="insert into printers_history (printers_history_date,printers_history_notes,changed_by,store_id,printer_id) ".
        "values ('$sesizari_log_date','$printers_history_notes','$changed_by','$store_id','$printer_id')";
        $result .="printers_history <$". $this->conn->query($sql)."$>"; 

        $sql="update printers set printer_status='$printer_status' where printer_id='$printer_id'";
        $result .="printers <$".$this->conn->query($sql)."$>";

        $sql="insert into printers_sesizari (sesizari_log_date,store_id,sesizari_log_problem_description,sesizari_log_problem,status_sesizare,printer_id,changed_by) ".
        "values ('$sesizari_log_date','$store_id','$sesizari_log_problem_description','$sesizari_log_problem','$status_sesizare','$printer_id','$changed_by')";
        $result  .="printers_sesizari <$".$this->conn->query($sql)."$>";  
        $result = trim(preg_replace('/[\t\n\r]+/', ' ', $result));
        if($result!=="")
            $res = json_encode('{"response":"Record Updated - '.$result.' "}');
        else
            $res = json_encode('{"response":"InregistrareaExista - '.$result.'"}');
        echo $res;
        $this->closeConection();
    }
    //-------------------------------------
    function Adauga_Sesizare_In_Sistem_fara_serie_imprimanta($new_printer_sn,$printer_brand,$printer_model,$store_id,$sesizari_log_problem,
    $sesizari_log_problem_description,$sesizari_log_date,$status_sesizare,$changed_by){
        $this->getConnection();        
        $store_id_name = $this->getStoreNameByID($store_id);
        //$printer_id=$this->getPrinteridbyPrinterSN($new_printer_sn);
        $printer_status="Trimisa de la Magazin";
        $result="";
        $printer_list_price="";
        $printer_installed_date="";
        $printers_history_notes = "Imprimanta a avut sesizare de la magazinul: <$store_id_name> cu statusul: <$printer_status> problema: <$sesizari_log_problem> - $sesizari_log_problem_description";//2
        //adaugare in baza de date a imprimantelor        
        $sql = "insert into printers (printer_brand, printer_model,printer_sn,store_id,printer_status,printer_list_price,printer_installed_date)".
        " values ('$printer_brand','$printer_model','$new_printer_sn','$store_id','$printer_status','$printer_list_price','$printer_installed_date')";
        $result.="printers <$".$this->conn->query($sql)."$>";  
        //adaugare in baza de date a logurilor la imprimante
        $printer_id=$this->getPrinteridbyPrinterSN($new_printer_sn);
        $sql="insert into printers_history (printers_history_date,printers_history_notes,changed_by,store_id,printer_id) ".
        "values ('$sesizari_log_date','$printers_history_notes','$changed_by','$store_id','$printer_id')";
        $result.="printers_history <$". $this->conn->query($sql)."$>";  
        //introducere in sesizari
        $sql="insert into printers_sesizari (sesizari_log_date,store_id,sesizari_log_problem_description,sesizari_log_problem,status_sesizare,printer_id,changed_by) ".
        "values ('$sesizari_log_date','$store_id','$sesizari_log_problem_description','$sesizari_log_problem','$status_sesizare','$printer_id','$changed_by')";
        $result .="printers_sesizari <$".$this->conn->query($sql)."$>";  
        $result = trim(preg_replace('/[\t\n\r]+/', ' ', $result));
        if($result!=="")
            $res = json_encode('{"response":"Record Updated -'.$result.'"}');
        else
            $res = json_encode('{"response":"InregistrareaExista -'.$result.'"}');
        echo $res;
        $this->closeConection();
    }

    function addNewPrinterToHistory($printer_sn,
    $store_id_name,$printer_status,$changed_by){
        $this->getConnection();
        $store_id = $this->getIDByStoreName($store_id_name);

        date_default_timezone_set("Europe/Bucharest");
        $date = date('Y-m-d H:i:s'); //1
        $printers_history_notes = "Imprimanta a fost adaugata la Magazinul: <$store_id_name> cu statusul: <$printer_status>";//2
        $printer_id = $this->getPrinteridbyPrinterSN($printer_sn); //5

        $sql="insert into printers_history (printers_history_date,printers_history_notes,changed_by,store_id,printer_id) ".
        "values ('$date','$printers_history_notes','$changed_by','$store_id','$printer_id')";
        $result = $this->conn->query($sql);  
        //$res = json_encode('{"response":"'.$result.'"}');
        //echo $res;
        $this->closeConection();
    }

    function addNewUser($user_name,$user_password,$user_role){
        $this->getConnection();        
        $sql = "insert into printer_users (user_name, user_password,user_role)".
        " values ('$user_name','$user_password','$user_role')";
        $result = $this->conn->query($sql);  
        $result = trim(preg_replace('/[\t\n\r]+/', ' ', $result));
        $res = json_encode('{"response":"'.$result.'"}');
        echo $res;
        $this->closeConection();
    }

    function updateGeneral($sql){
        $this->getConnection();        
        // $sql = "insert into printer_users (user_name, user_password,user_role)".
        // " values ('$user_name','$user_password','$user_role')";
        $result = $this->conn->query($sql); 
        $result = trim(preg_replace('/[\t\n\r]+/', ' ', $result));
        $res = json_encode('{"response":"'.$result.'"}');
        echo $res;
        $this->closeConection();
    }

    function getPrinteridbyPrinterSN($printerSN){
        $sql="select printer_id from printers where printer_sn='".$printerSN."'";
        $result = $this->conn->query($sql);  
        $row = $result->fetch_assoc();
        $printer_id = $row["printer_id"];
        return $printer_id;
    }
    function getPrinterSNByID($printer_id){
        $sql="select printer_sn from printers where printer_id='".$printer_id."'";
        $result = $this->conn->query($sql);  
        $row = $result->fetch_assoc();
        $printer_id = $row["printer_sn"];
        return $printer_id;
    }

    function updatePrintersHistory($storeChanges){
        $this->getConnection();        
        // $sql = "insert into printer_users (user_name, user_password,user_role)".
        // " values ('$user_name','$user_password','$user_role')";
        //$result = $this->conn->query($sql);  
        //$res = json_encode('{"response":"'.$result.'"}');
        $changed_by;//3
        $printer_sn;        
        $printers_history_notes;//2
        $store_name; //4 store_id
        date_default_timezone_set("Europe/Bucharest");
        $date = date('Y-m-d H:i:s'); //1
        foreach($storeChanges as $key => $value){
            $changed_by=$value['changed_by'];
            $printer_sn=$value['printer_sn'];
            $printers_history_notes=$value['printers_history_notes'];
            $store_name=$value['store_name'];
        }
        $printer_id = $this->getPrinteridbyPrinterSN($printer_sn); //5
        $sql="insert into printers_history (printers_history_date,printers_history_notes,changed_by,store_id,printer_id) ".
        "values ('$date','$printers_history_notes','$changed_by','$store_name','$printer_id')";
        $result = $this->conn->query($sql);  
        $result = trim(preg_replace('/[\t\n\r]+/', ' ', $result));
        $res = json_encode('{"response":"'.$result.'"}');
        echo $res;
        $this->closeConection();
    }

    }
?>