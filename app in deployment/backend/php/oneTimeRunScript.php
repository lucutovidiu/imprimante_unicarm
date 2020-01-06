<html><head></head><body><div>
<?php
header('Content-Type: Content-Type: text/plain');
//http://localhost/imprimanteunicarm/backend/php/oneTimeRunScript.php
$createTableaAndPopulate = new CreateTableaAndPopulate();

$createTableaAndPopulate->InitializeDB();
$createTableaAndPopulate->populateDBWithFakeInfo();


    class CreateTableaAndPopulate{
    public $servername = 'localhost';
    public $username = 'root';
    public $password = '';
    public $dbname = 'db_imprimante';
    public $conn;

    function getConnection(){
        // Create connection
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
        // Check connection
        if ($this->conn->connect_error) {
            $err='Error: connection failed: ' . $this->conn->connect_error;
            //die($err. '<br>');
            $res = 'response:'.$err;
            echo $res;
        }
    }
    
    function closeConection(){
        $this->conn->close();
    }

    function loadAllExistingStores(){
        $csv = array_map("str_getcsv", file("../../csvMagazine/magazine.csv"));
        foreach($csv as $value){
            $value[0] = trim($value[0]);
            $value[1] = trim($value[1]);
            $sql = "INSERT INTO store_info (store_name, store_location) VALUES ('".$value[0]."', '".$value[1]."')";
            $result = $this->conn->query($sql);  
            echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        }
        $sql = "INSERT INTO store_info (store_name, store_location) VALUES ('G29', 'Depozit Vetis')";
            $result = $this->conn->query($sql);  
            echo 'result: <'.$result.'> -> '.$sql.' <br/>';
    }

    function dropDatabaseTables(){
        $sql='drop table printers_history';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        
        $sql='drop table printer_select_options';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        
        $sql='drop table sesizari_log_problem_options';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        
        $sql='drop table printer_users';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        
        $sql='drop table printers_repairs_log';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        
        $sql='drop table printers_sesizari';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        
        $sql='drop table printers';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        
        $sql='drop table store_info';
        $result = $this->conn->query($sql);  
        echo 'result: <'.$result.'> -> '.$sql.' <br/>';
    }

    function populateUsersList(){
        $csv = array_map("str_getcsv", file("../../csvMagazine/magazine.csv"));
        foreach($csv as $value){
            $sql = "INSERT INTO printer_users (user_name, user_password,user_role) VALUES ('$value[0]', '$value[0]','store')";
            $result = $this->conn->query($sql);  
            echo 'result: <'.$result.'> -> '.$sql.' <br/>';
        }
    }

    function populateDBWithFakeInfo(){
        $this->getConnection();
        //Populate Store
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Loading stores</p>";
        $this->loadAllExistingStores();
        echo "<p> Finished Loading stores</p>";
        echo "--------------------------------------------------------------------------------------------";
        //-------------------------------------------------------------
        //Populate Printers
        //-------------------------------------------------------------
        echo "--------------------------------------------------------------------------------------------";
        // echo "<p> Loading Printers</p>";
        // $sql='insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("Canon","IX6850","test1",1,"Noua - In Depozit","2019-03-02 18:33:21")';
        // $result = $this->conn->query($sql);  
        // $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        // echo $res;
        // //-------------------------------------------------------------
        // $sql='insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("HP","MJ45","test2",2,"Noua - In Depozit","2019-03-02 18:33:21")';
        // $result = $this->conn->query($sql);  
        // $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        // echo $res;
        // //-------------------------------------------------------------
        // $sql='insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("Ricoh","MPC2550","test3",3,"Noua - In Depozit","2019-03-02 18:33:21")';
        // $result = $this->conn->query($sql);  
        // $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        // echo $res;
        // //-------------------------------------------------------------
        // $sql='insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("Lexmark","MG567","test4",4,"Noua - In Depozit","2019-03-02 18:33:21")';
        // $result = $this->conn->query($sql);  
        // $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        // echo $res;
        // //-------------------------------------------------------------
        // $sql='insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("Kyocera","TaskAlfa 5050ci","test5",5,"Noua - In Depozit","2019-03-02 18:33:21")';
        // $result = $this->conn->query($sql);  
        // $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        // echo $res;
        // //-------------------------------------------------------------
        // $sql='insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("Konica Minolta","KA456","test6",6,"Noua - In Depozit","2019-03-02 18:33:21")';
        // $result = $this->conn->query($sql);  
        // $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        // echo $res;
        // //-------------------------------------------------------------
        // $sql='insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("Konica Minolta","AS567","test7",7,"Noua - In Depozit","2019-03-24 6:08:43 PM")';
        // $result = $this->conn->query($sql);  
        // $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        // echo $res;
        // echo "<p> Finished Loading Printers</p>";
        echo "--------------------------------------------------------------------------------------------";
        //populate printer users
        //-------------------------------------------------------------
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Loading Users</p>";
        $sql = "INSERT INTO printer_users (user_name, user_password,user_role) VALUES ('admin', 'admin','admin')";
            $result = $this->conn->query($sql);  
            echo 'result: <'.$result.'> -> '.$sql.' <br/>';        
        $this->populateUsersList();
        echo "<p> Finished Loading Users</p>";
        echo "--------------------------------------------------------------------------------------------";
        //Populate printer select options
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Loading printer_select_options</p>";
        //-------------------------------------------------------------
        $sql='insert into printer_select_options (option_name) values("Noua - In Depozit")';
        $result = $this->conn->query($sql);  
        echo '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        //-------------------------------------------------------------
        $sql='insert into printer_select_options (option_name) values("Trimisa de la Magazin")';
        $result = $this->conn->query($sql);  
        echo '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        //-------------------------------------------------------------
        $sql='insert into printer_select_options (option_name) values("Primita de la Magazin")';
        $result = $this->conn->query($sql);  
        echo '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        //-------------------------------------------------------------
        $sql='insert into printer_select_options (option_name) values("Neutilizabila - Pentru piese")';
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql='insert into printer_select_options (option_name) values("Trimisa la Reparatie")';
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql='insert into printer_select_options (option_name) values("Trimisa la Magazin")';
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql='insert into printer_select_options (option_name) values("Reparata - In asteptate de utilizator")';
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        echo "<p> Finished Loading printer_select_options</p>";
        echo "--------------------------------------------------------------------------------------------";
        //sesizari_log_problem_options
        //-------------------------------------------------------------
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Loading sesizari_log_problem_options</p>";
        $sql='insert into sesizari_log_problem_options(problem_options_name) values("Hartia Se Blocheaza");';
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql='insert into sesizari_log_problem_options(problem_options_name) values("Problema De Conectare Retea");';
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql='insert into sesizari_log_problem_options(problem_options_name) values("Cod Eroare");';
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql='insert into sesizari_log_problem_options(problem_options_name) values("Probleme Cu Scanerul");';
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql='insert into sesizari_log_problem_options(problem_options_name) values("Problema Trimitere Email");';
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql='insert into sesizari_log_problem_options(problem_options_name) values("Alte Probleme - Dati Descriere Detaliata");';
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        echo "<p> Finished Loading sesizari_log_problem_options</p>";
        echo "--------------------------------------------------------------------------------------------";
        
        $this->closeConection();
    }

    function InitializeDB(){
        $this->getConnection();
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Drop Existing tables</p>";
        // deleting all existing tables
        $this->dropDatabaseTables();
        echo "<p> Finished Droping Existing tables</p>";
        echo "--------------------------------------------------------------------------------------------";
        //-------------------------------------------------------------
        echo "--------------------------------------------------------------------------------------------";
        echo "<p> Creating tables</p>";
        $sql=<<<EOD
        create table store_info(
            store_id                int auto_increment not null primary key,
            store_name              varchar(40) Unique not null,
            store_location          varchar(60) not null
        )ENGINE = InnoDB;
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql=<<<EOD
        create table Printers(
            printer_id                      int auto_increment not null primary key,
            printer_brand                   varchar(20) not null,
            printer_model                   varchar(30) not null,
            printer_sn                      varchar(90) unique not null,
            store_id                        int not null,
            printer_status                  varchar(40) not null,
            printer_list_price              int,
            printer_installed_date          DATE,
            CONSTRAINT `print_store_fk2` FOREIGN KEY (`store_id`) REFERENCES `store_info` (`store_id`)
                        ON UPDATE CASCADE
        )ENGINE = InnoDB; 
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql=<<<EOD
        create table printer_users(
            user_id                 int auto_increment not null primary key,
            user_name               varchar(40) UNIQUE not null,
            user_password           varchar(40) not null,
            user_role               varchar(40) not null,
            user_last_login         DATETIME,
            user_active             boolean,
            user_token              varchar(90)
        )ENGINE = InnoDB;  
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql=<<<EOD
        create table printers_history(
            printers_history_id     int auto_increment not null primary key,
            printers_history_date   DATETIME not null,
            printers_history_notes  text not null,
            changed_by              varchar(40),
            store_id                int not null,
            printer_id              int not null,
            CONSTRAINT print_store_fk1 FOREIGN KEY (printer_id) REFERENCES Printers (printer_id)
                        ON UPDATE CASCADE,
            CONSTRAINT print_store_fk10 FOREIGN KEY (store_id) REFERENCES store_info (store_id)
                    ON UPDATE CASCADE    
        )ENGINE = InnoDB; 
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql=<<<EOD
        create table printer_select_options(
            options_id              int auto_increment not null primary key,
            option_name             varchar(60) unique not null    
        )ENGINE = InnoDB; 
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql=<<<EOD
        create table printers_sesizari(
            sesizari_log_id                  int auto_increment not null primary key,
            sesizari_log_date                DATETIME not null,
            store_id                        int not null,
            sesizari_log_problem_description text,
            sesizari_log_problem             varchar(60) not null,
            status_sesizare                 varchar(20) not null,
            printer_id                      int not null,
            changed_by                      varchar(40),
            CONSTRAINT print_logs_fk1 FOREIGN KEY (printer_id) REFERENCES Printers (printer_id)
                    ON UPDATE CASCADE,
            CONSTRAINT print_store_fk3 FOREIGN KEY (store_id) REFERENCES store_info (store_id)
                    ON UPDATE CASCADE
        )ENGINE = InnoDB; 
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql=<<<EOD
        create table printers_repairs_log(
            repair_log_id           int auto_increment not null primary key,
            repair_date             DATETIME not null,
            repair_counter          int,
            repair_parts_fitted     varchar(150),
            repair_cost             int not null,
            repair_info             text,
            sesizari_log_id          int not null,
            printer_id              int not null,
            store_id                int not null,
            CONSTRAINT print_logs_fk8 FOREIGN KEY (printer_id) REFERENCES Printers (printer_id)
                    ON UPDATE CASCADE,
            CONSTRAINT print_fk6 FOREIGN KEY (sesizari_log_id) REFERENCES printers_sesizari (sesizari_log_id)
                        ON UPDATE CASCADE,
            CONSTRAINT print_store_fk7 FOREIGN KEY (store_id) REFERENCES store_info (store_id)
                    ON UPDATE CASCADE         
        )ENGINE = InnoDB; 
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        $sql=<<<EOD
        create table sesizari_log_problem_options(
            problem_options_id                  int auto_increment not null primary key,
            problem_options_name                varchar(70) unique not null    
        )ENGINE = InnoDB; 
EOD;
        $result = $this->conn->query($sql);  
        $res = '<br /><p>result : <'.$result.'> sql: '.$sql.'</p>';
        echo $res;
        //-------------------------------------------------------------
        echo "<p>Finished Creating tables</p>";
        echo "--------------------------------------------------------------------------------------------";
         $this->closeConection();
    }
    
   
    
}
?>
</div></body></html>