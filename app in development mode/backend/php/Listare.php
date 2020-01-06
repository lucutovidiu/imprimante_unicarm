<?php

header('Content-Type: application/json');
$_POST = json_decode(file_get_contents('php://input'), true);
    if(isset($_POST['type'])){
        if($_POST['type'] ==="Listare_Magazine"){       
        $update = new Updates();
        $update->listareMagazine();
        $update=null;
        }
        if($_POST['type'] ==="Listare_Imprimante"){       
        $update = new Updates();
        $update->listareImprimante();
        $update=null;
        }
        if($_POST['type'] ==="Listare_Imprimanta_dupa_magazin"){       
        $update = new Updates();
        $store_id=$_POST['store_id'];
        $update->Listare_Imprimanta_dupa_magazin($store_id);
        $update=null;
        }
        if($_POST['type'] ==="Listare_Log_Problem_Options"){       
        $update = new Updates();
        $update->listare_Log_Problem_Options();
        $update=null;
        }
        if($_POST['type'] ==="Listare_Useri"){ 
            $update = new Updates();
            $update->listareUseri();
            $update=null;
        }
        if($_POST['type'] ==="General_Listing"){            
            $update = new Updates();
            $update->General_Listing($_POST['sqlTableFildsList'],$_POST['sqlcommand']);
            $update=null;
        }

        if($_POST['type'] ==="Listare_Optiuni_Imprimanta"){            
            $update = new Updates();
            $update->Listare_Optiuni_Imprimanta();
            $update=null;
        }

        if($_POST['type'] ==="Listare_Lista_Sesizari_Active"){            
            $update = new Updates();
            $update->Listare_Lista_Sesizari_Active();
            $update=null;
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

    /*
{  
   "response":"ok",
   "storelist":[  
      {  
         "store_name":"",
         "store_location":""
      },
      {  
         "store_name":"",
         "store_location":""
      },
      {  
         "store_name":"",
         "store_location":""
      }
   ]
}



    */
    
    function listareMagazine(){
        $this->getConnection();
        $sql = "select store_id, store_name from store_info ORDER BY store_name ASC";
        $result = $this->conn->query($sql);  
        $output='{"response":"StoreLocationSugestion","store_location":[';

        while($row = $result->fetch_assoc()){                    
            $output .= '{ "store_name" :"'.$row['store_name'].'","store_id":"'.$row['store_id'].'" },';
        }

        $output1=substr($output,0,strlen ($output)-1);
        $output1.=']}';
        $output1 = trim(preg_replace('/[\t\n\r]+/', ' ', $output1));
        $res = json_encode($output1);
        echo $res;
        $this->closeConection();
    }
    function listareImprimante(){
        $this->getConnection();
        $sql = "select printer_id, printer_brand,printer_model,printer_sn from printers ORDER BY printer_brand ASC";
        $result = $this->conn->query($sql);  
        $output='{"response":"StoreLocationSugestion","printer_list":[';

        while($row = $result->fetch_assoc()){                    
            $output .= '{ "printer_id" :"'.$row['printer_id'].'","printer_brand":"'.$row['printer_brand'].'","printer_model":"'.$row['printer_model'].'","printer_sn":"'.$row['printer_sn'].'" },';
        }

        $output1=substr($output,0,strlen ($output)-1);
        $output1.=']}';
        $output1 = trim(preg_replace('/[\t\n\r]+/', ' ', $output1));
        $res = json_encode($output1);
        echo $res;
        $this->closeConection();
    }

    /*
select printer_id, printer_brand,printer_model,printer_sn, IFNULL((select status_sesizare from printers_sesizari where store_id=1 and status_sesizare='active'),"inactive") status_sesizare from printers where store_id=1
    */

    function Listare_Imprimanta_dupa_magazin($store_id){
        $this->getConnection();
        $outputFailed='{"response":"imprimanta_negasita"}';
        $enter=false;
        $sql = "select printer_id, printer_brand,printer_model,printer_sn, IFNULL((select status_sesizare from printers_sesizari where (store_id='$store_id' and printer_id = printers.printer_id) and status_sesizare='active'),'inactive') status_sesizare from printers where store_id='$store_id'";
        $result = $this->conn->query($sql); 
        $output='{"response":"detaliiImprimanta","detaliiImprimanta":[';
        while($row = $result->fetch_assoc()){ 
            $enter=true;
            $printer_id=$row['printer_id'];
            $printer_brand=$row['printer_brand'];
            $printer_model=$row['printer_model'];
            $printer_sn=$row['printer_sn'];
            $status_sesizare=$row['status_sesizare'];
            $output.='{"printer_id":"'.$printer_id.'","printer_brand":"'.$printer_brand.'","printer_model":"'.$printer_model.'",'.
                '"printer_sn":"'.$printer_sn.'","status_sesizare":"'.$status_sesizare.'"},';
        }
        $output=substr($output,0,strlen ($output)-1);
        $output.=']}';
        $output = trim(preg_replace('/[\t\n\r]+/', ' ', $output));
        if(!$enter){
            $res = json_encode($outputFailed);
        }else
            $res = json_encode($output);
        echo $res;
        $this->closeConection();
    }
    function listare_Log_Problem_Options(){
        $this->getConnection();
        $sql = "select problem_options_name from sesizari_log_problem_options";
        $result = $this->conn->query($sql);  
        $output='{"response":"LogProblemOptions","logProblemOptions":[';

        while($row = $result->fetch_assoc()){                    
            $output .= '{ "problem_options_name" :"'.$row['problem_options_name'].'"},';
        }

        $output1=substr($output,0,strlen ($output)-1);
        $output1.=']}';
        $outpu1 = trim(preg_replace('/[\t\n\r]+/', ' ', $output1));
        $res = json_encode($output1);
        echo $res;
        $this->closeConection();
    }

    function Listare_Optiuni_Imprimanta(){
        $this->getConnection();
        $sql = "select option_name from printer_select_options ORDER BY option_name ASC";
        $result = $this->conn->query($sql);  
        $output='{"response":"ListaOptiuniImprimanta","optiuniImprimanta":[';

        while($row = $result->fetch_assoc()){                    
            $output .= '{ "option_name" :"'.$row['option_name'].'"},';
        }

        $output1=substr($output,0,strlen ($output)-1);
        $output1.=']}';
        $output1 = trim(preg_replace('/[\t\n\r]+/', ' ', $output1));
        $res = json_encode($output1);
        echo $res;
        $this->closeConection();
    }
    function Listare_Lista_Sesizari_Active(){
        $this->getConnection();
        $anyUser=false;
        $sql = 'select psezi.sesizari_log_problem_description sesizari_log_problem_description, psezi.sesizari_log_id sesizari_log_id,psezi.sesizari_log_date sesizari_log_date,psezi.store_id store_id,psezi.printer_id printer_id,'.
        'psezi.sesizari_log_problem sesizari_log_problem,psezi.changed_by changed_by,prn.printer_brand printer_brand,'.
        ' prn.printer_model printer_model,prn.printer_sn printer_sn,stinf.store_name store_name,stinf.store_location store_location'.
        ' from printers_sesizari psezi,printers prn,store_info stinf where (psezi.printer_id = prn.printer_id) and (psezi.store_id = stinf.store_id ) and (psezi.status_sesizare = "active")';
        $result = $this->conn->query($sql);  
        $output='{"response":"Listare_Lista_Sesizari_Active","listaSesizari":[';

        while($row = $result->fetch_assoc()){      
            $anyUser= true;           
            $output .= '{"sesizari_log_problem_description" :"'.$row['sesizari_log_problem_description'].'","sesizari_log_id" :"'.$row['sesizari_log_id'].'","sesizari_log_date" :"'.$row['sesizari_log_date'].'","store_id" :"'.$row['store_id'].'","printer_id" :"'.$row['printer_id'].'",'.
                '"sesizari_log_problem" :"'.$row['sesizari_log_problem'].'","changed_by" :"'.$row['changed_by'].'","printer_brand" :"'.$row['printer_brand'].'",'.
                '"printer_model" :"'.$row['printer_model'].'","printer_sn" :"'.$row['printer_sn'].'","store_name" :"'.$row['store_name'].'",'.
                '"store_location" :"'.$row['store_location'].'"},';
        }

        $output=substr($output,0,strlen ($output)-1);
        $output.='],';

        $optionList='"printer_select_options":[';
        $sql = 'select option_name from printer_select_options order by option_name asc';
        $result = $this->conn->query($sql);  
        while($row = $result->fetch_assoc()){             
            $optionList .= '"'.$row['option_name'].'",';
        }
        $optionList=substr($optionList,0,strlen ($optionList)-1);
        $optionList.="]}";
        $output.=$optionList;

        if($anyUser===true)
        {
            $output = trim(preg_replace('/[\t\n\r]+/', ' ', $output));
            $res = json_encode($output);
            echo $res;
        }else{
            $output='{"response":"Nu_au_fost_gasite_sesizari_active"}';
            $output = trim(preg_replace('/[\t\n\r]+/', ' ', $output));
            $res = json_encode($output);
            echo $res;
        }
        
        $this->closeConection();
    }

    function listareUseri(){
        $this->getConnection();
        $sql = "select user_name, user_role,user_last_login from printer_users ORDER BY user_name ASC";
        $result = $this->conn->query($sql);  
        $output='{"response":"ok","storelist":[';
        
            
        
       
        while($row = $result->fetch_assoc()){                     
            $output .='{"user_name":"'.$row['user_name'].'","user_role":"'.$row['user_role'].'","user_last_login":"'.$row['user_last_login'].'"},';

        }

        $output1=substr($output,0,strlen ($output)-1);
        $output1.=']}';
        if($tester===false){
        $output1 = trim(preg_replace('/[\t\n\r]+/', ' ', $output1));
        $res = json_encode($output1);
        }else
        $res = '{"response":"no"}';
        echo $res;
        $this->closeConection();
    }

    function General_Listing($sqlTableFildsList,$sqlcommand){
        $this->getConnection();
        $output1="";

        $result = $this->conn->query($sqlcommand);  
            $output='{"response":"ok","storelist":[';
                while($row = $result->fetch_assoc()){
                    $output.='{';
                    foreach($sqlTableFildsList as $sqlField){
                        $output.='"'.$sqlField.'":"'.$row[$sqlField].'",';
                    }
                    $output = substr($output,0,strlen ($output)-1);
                    $output .= '},';
                }
                if(strlen($output)<31){
                    $output1 = '{"response":"NoItemsInTheList"}';
                }else{
                    $output1=substr($output,0,strlen ($output)-1);
                    $output1.=']}';
                }
                $output1 = trim(preg_replace('/[\t\n\r]+/', ' ', $output1));
                $res = json_encode($output1);                     
                echo  $res;
        

        
        $this->closeConection();
    }

    }
?>