<?php
/*
Tabel Imprimante
printer_repair_cost
printer_repair_date

create database DB_imprimante;

printer_main_location   - locatia Principala -unde este situata imrpimanta
printer_status          - in ce situatie este imprimanta - stricata - buna - trimisa la reparatie- venita de la repratie
                        - asteapta un nou magazin - noua
printer_installed_date  - data cand a fost prima data instalata
pentru sn nerecunocute va trebui sa am o intrare cu un id generic
store_info_printers - se pot adauga toate imprimantele cate l-e are un magazin odata ce imprimanta a fost adaugata in sistem
store_info_date     - data cand magazinul a avut imprimanta

-----------------------------------------------------------------------------------------------------------
create table store_info(
    store_id                int auto_increment not null primary key,
    store_name              varchar(40) Unique not null,
    store_location          varchar(60) not null
)ENGINE = InnoDB;  
   
insert into store_info (store_name,store_location) values ("G1","Ialomita");
insert into store_info (store_name,store_location) values ("G2","Telorman");
insert into store_info (store_name,store_location) values ("G3","Timisoara");
insert into store_info (store_name,store_location) values ("G4","Oradea");
insert into store_info (store_name,store_location) values ("G5","Bucuresti");
insert into store_info (store_name,store_location) values ("G6","Ploiesti");
insert into store_info (store_name,store_location) values ("G7","Giurgiu");
insert into store_info (store_name,store_location) values ("G8","Maramures");
insert into store_info (store_name,store_location) values ("G9","Campia Turzii");
insert into store_info (store_name,store_location) values ("G10","Cluj Napoca");

-----------------------------------------------------------------------------------------------------------
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

insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("Canon","IX6850","test1",1,"noua","2019-03-02 18:33:21");
insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("hp","mj45","test2",2,"noua","2019-03-02 18:33:21");
insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("ricoh","wer23","test3",3,"noua","2019-03-02 18:33:21");
insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("lexmark","ccs22","test4",4,"noua","2019-03-02 18:33:21");
insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("Kyocera","ttr4","test5",5,"noua","2019-03-02 18:33:21");
insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("Konica MInolta","uuuu","test6",6,"noua","2019-03-02 18:33:21");
insert into Printers (printer_brand,printer_model,printer_sn,store_id,printer_status,printer_installed_date) values ("Konica MInolta","uuuu","test7",7,"noua","2019-03-24 6:08:43 PM");

-----------------------------------------------------------------------------------------------------------    



user_role                   - admin         - drept total
                            - store         - drept de a loga probleme
                            - report        - drept la rapoarte 

create table printer_users(
    user_id                 int auto_increment not null primary key,
    user_name               varchar(40) UNIQUE not null,
    user_password           varchar(40) not null,
    user_role               varchar(40) not null,
    user_last_login         DATETIME,
    user_active             boolean,
    user_token              varchar(90)
)ENGINE = InnoDB; 

insert into printer_users (user_name,user_password,user_role) values('admin','admin','admin');
insert into printer_users (user_name,user_password,user_role) values('store','store','store');
insert into printer_users (user_name,user_password,user_role) values('raport','raport','raport');
insert into printer_users (user_name,user_password,user_role) values('ovi','ovi','admin');
insert into printer_users (user_name,user_password,user_role) values('G1','g1','store');
insert into printer_users (user_name,user_password,user_role) values('G2','g2','store');
insert into printer_users (user_name,user_password,user_role) values('G3','g3','store');
insert into printer_users (user_name,user_password,user_role) values('G4','g4','store');
insert into printer_users (user_name,user_password,user_role) values('G5','g5','store');
insert into printer_users (user_name,user_password,user_role) values('G6','g6','store');

-----------------------------------------------------------------------------------------------------------

istoria imprimantelor la ce magazine a fost pana in prezent
printers_history_date  - data cand s-a adaugat in istorie
printers_history_notes - //notite ex: trimisa de la magazin la firma sau la reparatie, trimisa la magazin dupa reparatie
                       - trimisa de la locatie veche la locatie noua cu status nou sau nimic - email
                       - ramasa la aceeasi locatie doar statusul s-a modificat  -emal 
changed_by             - userul ce a facut modificarea

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

-----------------------------------------------------------------------------------------------------------

- Optiuni Pentru status la imprimante

create table printer_select_options(
    options_id              int auto_increment not null primary key,
    option_name             varchar(30) not null    
)ENGINE = InnoDB; 

insert into printer_select_options (option_name) values("Noua");
insert into printer_select_options (option_name) values("Stare Buna");
insert into printer_select_options (option_name) values("Stricata");
insert into printer_select_options (option_name) values("Neutilizabila");
insert into printer_select_options (option_name) values("In Reparatie");
insert into printer_select_options (option_name) values("Pentru Piese");


-----------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------

repair_date             - data cand a fost reparata
repair_parts_fitted     - ce piese au fost instalate la imprimanta
repair_counter          - la cate copii a fost reparata
repair_cost             - costul reparatiei
repair_info             - informatii despre ce a fost reparat 
printer_log_id          - fiecare reparatie este bazata pe o sesizare
- la fiecare reparatie se poate introcuce noul status in tabela <PRINTERS> si in <printers_history>


create table printers_repairs_log(
    repair_log_id           int auto_increment not null primary key,
    repair_date             DATETIME not null,
    repair_counter          int,
    repair_parts_fitted     varchar(150),
    repair_cost             int not null,
    repair_info             text,
    printer_log_id          int not null,
    printer_id              int not null,
    store_id                int not null,
    CONSTRAINT print_logs_fk8 FOREIGN KEY (printer_id) REFERENCES Printers (printer_id)
            ON UPDATE CASCADE,
    CONSTRAINT print_fk6 FOREIGN KEY (printer_log_id) REFERENCES printers_sesizari (printer_log_id)
                ON UPDATE CASCADE,
    CONSTRAINT print_store_fk7 FOREIGN KEY (store_id) REFERENCES store_info (store_id)
            ON UPDATE CASCADE         
)ENGINE = InnoDB; 

-----------------------------------------------------------------------------------------------------------

dupa sesizare in momentul trimiterii in reparatie imprimanta trebui modificat statusul la In Reparatie pentru a stii ce imprimante sunt in reparatie si ce avem pe stock
probleme legate de imprimanta fiecare sesizare
printer_log_date                    - data cand s-a facut sesizare la o problema la imprimanta
store_id                            - locatia din care s-a facut sesizarea ( poate un magazin G*)
printer_log_problem                 - problema generala raportata //set probleme generale - Hartia se blochaeaza- eroare -  //se poate scrie modelul imprimantei daca nu este gasit in sistem
printer_action_taken                - actiune luata: ex: trimisa la firma, reparata prin telefon
printer_log_problem_description     - lista cu probleme generale: Hartia se blocheaza, Apare Eroare, Necesita Cerneala,Alta problema
status_sesizare                     - Inca ---  Deschisa --- Inchisa
- la fiecare reparatie se poate introcuce noul status in tabela <PRINTERS> si in <printers_history>

create table printers_sesizari(
    sesizari_log_id                  int auto_increment not null primary key, 
    sesizari_log_date                DATETIME not null,
    store_id                        int not null,
    sesizari_log_problem_description text,
    sesizari_log_problem             varchar(60) not null,
    status_sesizare                 varchar(20) not null,
    printer_id                      int not null,
    CONSTRAINT print_logs_fk1 FOREIGN KEY (printer_id) REFERENCES Printers (printer_id)
            ON UPDATE CASCADE,
    CONSTRAINT print_store_fk3 FOREIGN KEY (store_id) REFERENCES store_info (store_id)
            ON UPDATE CASCADE
)ENGINE = InnoDB; 

-----------------------------------------------------------------------------------------------------------
tabel optiuni probleme

create table printer_log_problem_options(
    problem_options_id                  int auto_increment not null primary key,
    problem_options_name                varchar(70) not null    
)ENGINE = InnoDB; 

insert into printer_log_problem_options(problem_options_name) values("Hartia Se Blocheaza");
insert into printer_log_problem_options(problem_options_name) values("Problema De Conectare Retea");
insert into printer_log_problem_options(problem_options_name) values("Cod Eroare");
insert into printer_log_problem_options(problem_options_name) values("Probleme Cu Scanerul");
insert into printer_log_problem_options(problem_options_name) values("Problema Trimitere Email");
insert into printer_log_problem_options(problem_options_name) values("Alte Probleme - Dati Descriere Detaliata");

-----------------------------------------------------------------------------------------------------------

program interfata meniu -   
Administrare    user role - admin
{
Updatare Informatii         - (Useri, Imprimante)   slecteaza un intreg tabel ca si excel dupa imprimante update status, store id, cand a fost instalata
                              sau useri si poate face modificari user_role pot fi separata cu o virgula, parola     
Updatare Status Imprimanta  - unde e imprimanta la momentul actual si updatare printers_history 

Introducere Imprimanta noua - si updatare printers_history
Introducere Magazin Nou     - si updatare printers_history
Introducere user nou        - si updatare printers_history
Introducere Reparatie       - formular ce obtine imprimanta si se pot introduce detaliile in tabela printers_repairs_log

Vizualizare Listare Magazine
Vizualizare Listare useri
Vizualizare Listare imprimante
}      

Probleme Imprimante - user role - store
{
    Sesizare Problema noua      - formular de introducere problema noua la o imprimanta in printers_repairs_log si updatare printers_history
    Anulare sesizare            - se va anula statusul la imprimanta si se va loga in printers_history ca si anulare sesizare, la fel si
                                  in printers_problem_logs,
}

Rapoarte       user role - raport
{
Pret reparatii per imprimante               - se poate selecta o imprimanta si se poate vedea cat a costat reparatia pana in momentul de fata
Unde a fost imprimanta pana acuma           - se poate selecta o imprimanta si sa se poata vedea istoria ei pana acuma unde a fost in ce magazine
Un magazin ce imprimante a avut pana acuma  - se obtine tot din printers info 
Un magazin ce probleme a avut la imprimante - printers_problem_logs dupa magazin 
Pret reparatii per magazin                  - cu cost la fiecare problema, de luat statusul de la imprimanta
                                              si daca este in curs de reparatie atunci se stie de unde a venit imprimanta

Istorie reparatii imprimante                - in ce magazine a fost imprimanta si de ce rapratii a avut parte se poate selecta dupa imprimanta 
Ce probleme a avut imprimanta pana acuma      si se vede ce probleme si la ce magazine a avut probleme 
}
-----------------------------------------------------------------------------------------------------------
*/


?>