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

create table Printers(
    printer_id                      int auto_increment not null primary key,
    printer_brand                   varchar(15) not null,
    printer_model                   varchar(30) not null,
    printer_sn                      varchar(40) unique not null,
    store_id                        varchar(40) not null,
    printer_status                  varchar(40) not null,
    printer_list_price              int,
    printer_installed_date          DATE,
    CONSTRAINT print_store_fk2 FOREIGN KEY (store_id) REFERENCES store_info (store_id)
                ON UPDATE CASCADE
)ENGINE = InnoDB; 

INSERT INTO Printers (printer_brand, printer_model, printer_sn,printer_main_location,printer_status)
VALUES                 ('ricoh',       'mp2550',      'rnp32434234','office it','good');

update Printers set printer_id=5 where printer_id=1;

repair_date             - data cand a fost reparata
repair_parts_fitted     - ce priese au fost instalate la imprimanta
repair_counter          - la cate copii a fost reparata
repair_cost             - sostul reparatiei
repair_info             - informatii despre ce a fost reparat 
store_id                - din ce magazin a venit imprimanta in tabela costului de reparatie


create table printers_repairs_log(
    repair_log_id           int auto_increment not null primary key,
    repair_date             DATE not null,
    repair_counter          int,
    repair_parts_fitted     varchar(50),
    repair_cost             int not null,
    repair_info             text not null,
    printer_id              int not null,
    store_id                int not null,
    CONSTRAINT print_fk1 FOREIGN KEY (printer_id) REFERENCES Printers (printer_id)
                ON UPDATE CASCADE,
    CONSTRAINT print_store_fk4 FOREIGN KEY (store_id) REFERENCES store_info (store_id)
                ON UPDATE CASCADE             
)ENGINE = InnoDB; 

{

store_info_printers - se pot adauga toate imprimantele cate l-e are un magazin odata ce imprimanta a fost adaugata in sistem
store_info_date     - data cand magazinul a avut imprimanta

create table store_info(
    store_id                int auto_increment not null primary key,
    store_name              varchar(40) not null,
    store_location          varchar(40) not null
)ENGINE = InnoDB; 


istoria imprimantelor la ce magazine a fost pana in prezent
printers_history_date  - data cand s-a adaugat in istorie
printers_history_notes - notite ex: trimisa de la magazin la firma sau la reparatie, trimisa la magazin dupa reparatie


create table printers_history(
    printers_history_id     int auto_increment not null primary key,
    printers_history_date   DATE not null,
    printers_history_notes  varchar(60) not null,
    store_id                int not null,
    printer_id              int not null,
    CONSTRAINT print_store_fk1 FOREIGN KEY (printer_id) REFERENCES Printers (printer_id)
                ON UPDATE CASCADE,
    CONSTRAINT print_store_fk2 FOREIGN KEY (store_id) REFERENCES store_info (store_id)
                ON UPDATE CASCADE       
)ENGINE = InnoDB; 


INSERT INTO store_info (store_id, store_location)
VALUES                 ('G23',       'Vicov');

}

probleme legate de imprimanta fiecare sesizare
printer_log_date                    - data cand s-a facut sesizare la o problema la imprimanta
store_id                            - locatia din care s-a facut sesizarea ( poate un magazin G*)
printer_log_problem                 - problema raportata //se poate scrie modelul imprimantei daca nu este gasit in sistem
printer_action_taken                - actiune luata: ex: trimisa la firma, reparata prin telefon
printer_log_problem_description     - lista cu probleme generale: Hartia se blocheaza, Apare Eroare, Necesita Cerneala,Alta problema

create table printers_problem_logs(
    printer_log_id                  int auto_increment not null primary key,
    printer_log_date                DATE not null,
    store_id                        varchar(40) not null,
    printer_log_problem_description varchar(40) not null,
    printer_log_problem             varchar(40) not null,
    printer_action_taken            varchar(40) not null,
    printer_id                      int,
    CONSTRAINT print_logs_fk1 FOREIGN KEY (printer_id) REFERENCES Printers (printer_id)
            ON UPDATE CASCADE,
    CONSTRAINT print_store_fk3 FOREIGN KEY (store_id) REFERENCES store_info (store_id)
            ON UPDATE CASCADE
)ENGINE = InnoDB; 


user_role                   - admin         - drept total
                            - store         - drept de a loga probleme
                            - report        - drept la rapoarte 

create table printer_users(
    user_id                 int auto_increment not null primary key,
    user_name               varchar(40) not null,
    user_password           varchar(40) not null,
    user_role               varchar(40) not null
)ENGINE = InnoDB; 



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

*/


?>