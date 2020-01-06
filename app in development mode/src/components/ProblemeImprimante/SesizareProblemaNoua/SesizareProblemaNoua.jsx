import React, { Component } from 'react'
import $ from 'jquery'
import axios from 'axios'
import ModalWindow from '../../administrare/ModalComponent/ModalWindow'

class SesizareProblemaNoua extends Component {
    state = {
        storelist: [],
        logProblemOptions: [],
        result: "",
        nuGasescSerie: "false",
        detaliiImprimanta: {},
        foundPrinters: [],
        validateCount: 5,
        modal_state: "",
        modal_title: "",
        modal_body: ""
    }

    resetState = () => {
        this.setState({
            ...this.state,
            modal_state: "",
            modal_title: "",
            modal_body: ""
        })

    }

    sendEmail = (configEmail) => {
        let origin = window.origin;
        //console.log("email to send: " + configEmail);
        axios.post(origin + '/api/SendMail', configEmail)
            .then(function (data) {
                // console.log(data)
            });
    }

    // async sendEmail(configEmail) {
    //     //let origin = window.origin;
    //     await $.post('http://192.168.0.8:3030/imprimanteunicarm/backend/phpMail/SendMail.php', configEmail)
    //         .done(function (data) {
    //             // alert("Data Loaded: " + data);
    //         });
    // }


    handleSelectPrinterSN = (e) => {
        // console.log(this.state);
        // console.log(e.target.value.split("~")[2]);
        let test = this.state.foundPrinters.find(item => item.printer_sn === e.target.value.split("~")[2]).status_sesizare;
        if (test === "active") {
            $('#printer_sn').prop('selected', false).find('option:first').prop('selected', true);
            this.validatorPrinterSN("", "Exista deja o sesizare pentru dispozitivul selectat,selectati altul sau pentru mai multe detalii contactati IT", "Eroare!!!");
        } else {
            $("#nuGasescSeriaBtn").addClass("disabled");
        }
        //$("#printer_sn").attr("disabled");
    }

    componentDidUpdate = () => {
        //console.log(this.state);
        //$("#printer_sn").attr("disabled");

    }

    // afiseaza un mesaj cu msg si titlu pentru popup caz de eroare
    validatorPrinterSN = (printerSn, msg, title) => {
        let allOK = true;
        if (printerSn.trim() === "") allOK = false;
        if (!allOK) {
            this.setState({
                ...this.state,
                modal_state: "yes",
                modal_title: title,
                modal_body: msg
            })
        }
        return allOK;

    }

    handleBackButton = (e) => {
        $("#printer_sn").removeClass('disabled');
        $("#nuGasescSeriaBtn").removeClass("disabled");
        let newObj = Object.assign({}, {
            nume_magazin: "",
            locatie_magazin: "",
            result: "",
            foundPrinters: [],
            detaliiImprimanta: {},
            nuGasescSerie: "false"
        });
        this.setState(newObj);
    }

    formValidator = () => {

    }

    /// verifica daca seria imrimantei este gasita in system daca da o introduce in obiectul state a clasei
    printerSnDBSearch = (store_id) => {
        let cautareImprimanta = { type: "Listare_Imprimanta_dupa_magazin", store_id: store_id };
        let origin = window.origin;
        axios.post(origin + '/api/Listare', cautareImprimanta)
            .then((res) => {
                //console.log(res.data);
                try {
                    const { response } = JSON.parse(res.data);
                    //console.log(store_location);
                    if (response === "imprimanta_negasita") {
                        $("#nuGasescSeriaBtn").removeClass("disabled");
                        this.validatorPrinterSN("", "Nu s-a putut gasii nici o imprimanta in sistem pentru magazinul dumneavoastra apasati pe butonul 'NU GASESC DISPOZITIV' pentru a introduce imprimanta manual", "Nici un dispozitiv nu s-a gasit In Sistem!!!");
                        let newObj = Object.assign({}, {
                            nume_magazin: "",
                            locatie_magazin: "",
                            result: "",
                            foundPrinters: [],
                            detaliiImprimanta: {},
                            nuGasescSerie: "false"
                        });
                        this.setState(newObj);
                    }
                    if (response === "detaliiImprimanta") {
                        // $("#printer_sn").attr("disabled");
                        $("#nuGasescSeriaBtn").removeClass('disabled');
                        this.setState({
                            nuGasescSerie: "false"
                        });
                        const { detaliiImprimanta } = JSON.parse(res.data);
                        // $("#printer_sn").val("GASIT: " + detaliiImprimanta.printer_brand + " - " + detaliiImprimanta.printer_model);
                        // $("#printer_sn").attr('disabled', 'disabled');
                        // $("#printer_sn").addClass('disabled');
                        // $("#cautaDetaliiImprimanta").addClass("disabled");
                        // $("#printer_sn").css("background-color", "#0074D9");
                        // $("#nuGasescSeriaBtn").addClass("disabled");

                        this.setState({ ...this.state, foundPrinters: detaliiImprimanta });
                        //console.log(this.state);

                    }
                } catch (e) {
                    // console.error(e);
                    $("#submitBtnRecord").text("Conexiune cu baza de date Inexistenta!!");
                    $("#submitBtnRecord").addClass("bg-red");
                }
            });
    }

    handleStoreChange = (e) => {

        let store_name = this.state.storelist.find(item => {
            return item.store_name === e.target.value
        });
        $('#printer_sn').prop('selected', false).find('option:first').prop('selected', true);
        this.printerSnDBSearch(store_name.store_id);
    }

    // preia toate comenzile click
    handleClick = (e) => {
        if (e.target.id === "cautaDetaliiImprimanta") {

            if ($("#printer_sn").val() === null) {
                this.validatorPrinterSN("", "Selectati Seria Dispozitivului Dumneavoastra sau apasati 'NU GASESC DISPOZITIV' daca nu o gaseste sistemul'", "Informatii Incorecte!!!");
            }
        }
        if (e.target.id === "nuGasescSeriaBtn") {
            if (typeof this.state.detaliiImprimanta.printer_id === "undefined") {
                //$("#printer_sn").attr('disabled', 'disabled');
                $("#printer_sn").addClass('disabled');
                $("#nuGasescSeriaBtn").addClass("disabled");
                this.setState({ ...this.state, nuGasescSerie: "true" });
                $("#cautaDetaliiImprimanta").addClass("disabled");
            }
        }
    }
    //verifica daca un field este gol
    isEmpty = (field) => {
        if (field === null || typeof field === "undefined" || field === "")
            return true;
        else
            return false;
    }

    /// valideaza toate fieldurile in formular
    formValidator = () => {
        //console.log($("#printer_sn").hasClass('disabled'));
        let msg = "";
        let allOK = true;
        //console.log(this.state);
        for (let i = 1; i <= this.state.validateCount; i++) {
            if (typeof $(".validatefield" + i).val() !== "undefined") {
                if (this.isEmpty($(".validatefield" + i).val()) !== null) {
                    if (this.isEmpty($(".validatefield" + i).val())) {
                        if (!$(".validatefield" + i).hasClass("disabled")) {
                            let text = $("#validatefieldmsg" + i).text() + " este Obligatoriu!!!";
                            msg += "<p> " + text + " </p>";
                            allOK = false;
                        }
                    }
                }
            }
        }

        if ((allOK && !$("#printer_sn").hasClass('disabled'))) {
            this.setState({
                ...this.state,
                modal_state: "yes",
                modal_title: "Eroare!!!",
                modal_body: "Seria Dispozitivului Trebuie validata mai intai!!! Introduceti seria si apasati pe 'VALIDARE SERIE'!"
            })
        }

        if (!allOK) {
            this.setState({
                ...this.state,
                modal_state: "yes",
                modal_title: "Informatii Incorecte!!!",
                modal_body: msg
            })
        }
        return allOK;
    }

    /// daca validarea este ok se poate creea obiectul care va fi trimis la baza de date pentru a putea fi introdus
    introduSesizareNoua = () => {

        //console.log();

        let store_id_name = this.state.storelist.filter(item => item.store_name === $("#store_id_name").val());
        let store_id = store_id_name[0].store_id;

        //let printer_sn = $("#printer_sn").val();//de verificat

        let problem_options_name = $("#problem_options_name").val();
        let sesizari_log_problem_description = $.trim($("#sesizari_log_problem_description").val());
        //console.log(this.state);
        let adaugaSesizareInSistem;

        if (!$("#printer_sn").hasClass('disabled')) {
            //console.log("this.state.detaliiImprimanta.printer_id", this.state.detaliiImprimanta.printer_id);
            adaugaSesizareInSistem = {
                type: "Adauga_Sesizare_In_Sistem_cu_serie_imprimanta_existenta",
                store_id: store_id,
                printer_id: this.state.foundPrinters.find(item => item.printer_sn === $("#printer_sn").val().split("~")[2]).printer_id,
                sesizari_log_problem: problem_options_name,
                sesizari_log_problem_description: sesizari_log_problem_description,
                changed_by: sessionStorage.getItem("user_name")
            }
            this.setState({ ...this.state, detaliiImprimanta: {} });
        }

        if ($("#printer_sn").hasClass('disabled')) {
            let printer_brand = $("#printer_brand").val();
            let printer_model = $("#printer_model").val();
            let new_printer_sn = $("#new_printer_sn").val();

            if (new_printer_sn === "")
                new_printer_sn = "genericSNstoreid:" + store_id + ":prnmodel:" + printer_model + ":mathrand:" + Math.floor(Math.random() * 50);

            adaugaSesizareInSistem = {
                type: "Adauga_Sesizare_In_Sistem_fara_serie_imprimanta",
                store_id: store_id,
                new_printer_sn: new_printer_sn,
                printer_brand: printer_brand,
                printer_model: printer_model,
                sesizari_log_problem: problem_options_name,
                sesizari_log_problem_description: sesizari_log_problem_description,
                changed_by: sessionStorage.getItem("user_name")
            }
        }



        //console.log(adaugaSesizareInSistem);
        //console.log(this.state);
        let printer_brand = "";
        let printer_model = "";
        if (this.state.nuGasescSerie === "false") {
            printer_brand = this.state.foundPrinters.find(item => item.printer_id === adaugaSesizareInSistem.printer_id).printer_brand;
            printer_model = this.state.foundPrinters.find(item => item.printer_id === adaugaSesizareInSistem.printer_id).printer_model;
        } else {
            printer_brand = adaugaSesizareInSistem.printer_brand
            printer_model = adaugaSesizareInSistem.printer_model
        }



        let store_name = this.state.storelist.find(item => item.store_id === adaugaSesizareInSistem.store_id).store_name;
        let emailMsg = `
        <html>
        <head>
        <title>Sezizare Noua</title>
        </head>
        <body>
        <br/><br/>
        &nbsp;&nbsp;&nbsp;<h3>S-a creat o sezizare noua pentru Imprimanta detaliata mai jos</h3>
        <br/><br/>
        <table width="auto" border="0" cellspacing="3" cellpadding="6" style="border:1px solid #ccc;">
           <tr ><th>Creat De</th>
           <td style="border-bottom:1px solid #ccc;">${adaugaSesizareInSistem.changed_by}</td>
           </tr>
           <tr ><th>Nume Magazin</th>
           <td style="border-bottom:1px solid #ccc;">${store_name}</td>
           </tr>
           <tr><th>Printer Brand</th>
           <td style="border-bottom:1px solid #ccc;">${printer_brand}</td>
           </tr>
           <tr><th>Printer Model</th>
           <td style="border-bottom:1px solid #ccc;">${printer_model}</td>
           </tr>
           <tr><th>Problema</th>
           <td style="border-bottom:1px solid #ccc;">${adaugaSesizareInSistem.sesizari_log_problem}</td>
           </tr>
           <tr><th>Descriere</th>
           <td>${adaugaSesizareInSistem.sesizari_log_problem_description}</td>
           </tr>           
            </table>
            <br/> <br/>
        
            Cu respect,<br/>&nbsp;&nbsp;&nbsp;&nbsp;Sesizari Imprimante Unicarm
            </body>
            </html>
        `;


        let origin = window.origin;
        axios.post(origin + '/api/Updates', adaugaSesizareInSistem)
            .then((res) => {
                //console.log(res.data);
                try {
                    const { response } = JSON.parse(res.data);
                    //console.log(store_location);
                    if (response.toString().startsWith("InregistrareaExista")) {
                        this.validatorPrinterSN("", "Daca nu gasiti Seria Dispozitivului sau daca sistemul nu o gaseste apasati butonul - NU GASESC DISPOZITIV", "Dispozitiv Negasit In Sistem!!!");
                        $("#cautaDetaliiImprimanta").removeClass("disabled");
                        this.setState({
                            ...this.state,
                            result: "InregistrareaExista",
                        })
                    }
                    if (response.toString().startsWith("Record Updated")) {
                        this.setState({
                            ...this.state,
                            result: "Record Updated",
                        })
                        let configEmail = {
                            emailMsg: emailMsg,
                            emailSubject: "Sesizare Noua - " + store_name,
                            emailToAddress: "it@unicarm.ro," + store_name + "@unicarm.ro",
                            type: "SesizareNouaEmail",
                            store_name: store_name
                        }
                        //console.log(this.configEmail);
                        this.sendEmail(configEmail);
                    }
                } catch (e) {
                    console.error(e);
                    $("#submitBtnRecord").text("Conexiune cu baza de date Inexistenta!!");
                    $("#submitBtnRecord").addClass("bg-red");
                }
            });
    }

    // preia comanda de la trimiterea formularului
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.formValidator()) {
            this.introduSesizareNoua();
        }


        // console.log(store_id_name, " - ", printer_sn, " - ", problem_options_name, " - ", sesizari_log_problem_description);

        // console.log(" -> ", printer_brand, " - ", printer_model, " - ", new_printer_sn);


    }

    /// populeaza lista de magazine pentru formular
    updateStateStoreList = () => {
        const newObj = Object.assign({}, { payload: "NONE" }, { type: "Listare_Magazine" });
        if (this.state.storelist.length === 0) {
            var th = this;
            let origin = window.origin;
            axios.post(origin + '/api/Listare', newObj)
                .then((res) => {
                    //console.log(res)
                    try {
                        const { response, store_location } = JSON.parse(res.data);
                        //console.log(store_location);
                        if (response === "StoreLocationSugestion") {
                            this.setState({ ...this.state, storelist: [...store_location] });
                            setTimeout(() => {
                                th.updateStateLogProblemOptions();
                            }, 500);
                            //console.log(this.state);
                        }
                    } catch (e) {
                        //console.error(e);
                        $("#submitBtnRecord").text("Conexiune cu baza de date Inexistenta!!");
                        $("#submitBtnRecord").addClass("bg-red");
                    }
                });
            var today = new Date();
            this.setState({
                ...this.state,
                date: today
            });
        }
    }

    // componenta in caz de nu se beneficiaza de serie de imprimanta ori daca aceasta nu exista
    componentaNuGasescImprimanta = () => {
        return (
            <div className="col-md-12"><br />
                <div className="form-group">
                    <label id="validatefieldmsg3" className="text-medium text-danger" htmlFor="validatefield3">*Brand Imprimanta</label>
                    <input type="text" className="validatefield3 form-control" id="printer_brand" placeholder="Brand Imprimanta" />
                </div>
                <div className="form-group">
                    <label id="validatefieldmsg4" className="text-medium text-danger" htmlFor="validatefield4">*Model Imprimanta</label>
                    <input type="text" className="validatefield4 form-control printer_model" id="printer_model" placeholder="Model Imprimanta" />
                </div>
                <div className="form-group">
                    <label className="text-medium text-info" htmlFor="new_printer_sn">*Serie Imprimanta daca o gasiti</label>
                    <input defaultValue={$("#printer_sn").val() && $("#printer_sn").val().toString()} type="text" className="form-control" id="new_printer_sn" placeholder="Serie Imprimanta" />
                </div>
            </div>
        )
    }

    //preia din baza de date lista de optiuni disponibile pentru a selecta problema generala la imrpimanta
    updateStateLogProblemOptions = () => {
        const newObj = Object.assign({}, { payload: "NONE" }, { type: "Listare_Log_Problem_Options" });
        if (this.state.logProblemOptions.length === 0) {
            let origin = window.origin;
            axios.post(origin + '/api/Listare', newObj)
                .then((res) => {
                    //console.log(res)
                    try {
                        const { response, logProblemOptions } = JSON.parse(res.data);
                        //console.log(store_location);
                        if (response === "LogProblemOptions") {
                            this.setState({ ...this.state, logProblemOptions: [...logProblemOptions] });
                            //console.log(this.state);
                        }
                    } catch (e) {
                        console.error(e);
                        $("#submitBtnRecord").text("Conexiune cu baza de date Inexistenta!!");
                        $("#submitBtnRecord").addClass("bg-red");
                    }
                });
            var today = new Date();
            this.setState({
                ...this.state,
                date: today
            });
        }
    }



    componentWillMount() {
        if (sessionStorage.getItem('user_name') === "" && sessionStorage.getItem('token') === "")
            this.props.history.push('/');
        if (sessionStorage.getItem('role') !== "admin" && sessionStorage.getItem('role') !== "store" && sessionStorage.getItem('role') !== "storeraport")
            this.props.history.push('/');
        this.updateStateStoreList();
    }

    // compponenta select de a lista magazinele disponibile
    listaMagazine = () => {
        let user_name = sessionStorage.getItem("user_name").toUpperCase();
        let found = this.state.storelist.find(item => item.store_name === user_name);
        //console.log(found);
        if (typeof found === "undefined") {
            return (
                <div className="container-fluid">
                    <div className="input-field col s12 m6">
                        <select onChange={this.handleStoreChange} id="store_id_name" defaultValue="Magazine" className="validatefield1 browser-default">
                            <option disabled >Magazine</option>
                            {this.state.storelist.map((item, i) => {
                                return <option key={i}>{item['store_name']}</option>
                            })}
                        </select>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="container-fluid">
                    <div className="input-field col s12 m6">
                        <select onChange={this.handleStoreChange} id="store_id_name" defaultValue={found.store_name} className="validatefield1 browser-default">
                            <option>{found.store_name}</option>
                        </select>
                    </div>
                </div>
            )
        }
    }

    /// componenta select de a selecta problemele generala 
    listaOptiuniProbleme = () => {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="input-field col-md-8">
                        <select id="problem_options_name" defaultValue="Selectati Problema Dispozitiv" className="validatefield5 browser-default">
                            <option disabled >Selectati Problema Dispozitiv</option>
                            {this.state.logProblemOptions.map((item, i) => {
                                return <option key={i}>{item['problem_options_name']}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>
        )
    }


    /// componenta generala a paginei
    sesizareComponent = () => {
        if (this.state.result === "") {
            return (
                <form onSubmit={this.handleSubmit} >
                    <div className="form-group">
                        <div className="container-fluid">
                            <div className="row row-no-gutters">
                                <div className="col-md-12">
                                    <label id="validatefieldmsg1" className="text-info text-medium" htmlFor="nume_magazin">*Alege Locatie Magazin</label>
                                    <this.listaMagazine />
                                    {/* <input onChange={this.handleChange} type="text" className="validatefield1 form-control" id="nume_magazin" placeholder="Nume Magazin" /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="container-fluid">
                            <div className="row row-no-gutters">
                                <div className="col-md-12">
                                    <label id="validatefieldmsg2" className="text-info text-medium" htmlFor="validatefield2">*Introdu Detalii Dispozitiv Defect</label>
                                </div>
                            </div>
                            <div className="row row-no-gutters">
                                <div className="col-md-5 col-sm-12 col-xs-12">
                                    <select onChange={this.handleSelectPrinterSN} className="browser-default validatefield2" id="printer_sn" defaultValue="Dispozitive Gasite">
                                        <option disabled >Dispozitive Gasite</option>
                                        {this.state.foundPrinters.map((item, i) => {
                                            return <option key={i}>{item.printer_brand + "~" + item.printer_model + "~" + item.printer_sn}</option>
                                        })}
                                    </select>
                                    {/* <input type="text" className="form-control validatefield2" id="printer_sn" placeholder="Introdu Serie Imprimanta" /> */}
                                </div>

                                <div className="col-md-4 col-sm-12 col-xs-12 margin-top-2rem-md margin-bottom-2rem-md">
                                    <span onClick={this.handleClick} id="nuGasescSeriaBtn" className="btn btn-primary">NU GASESC DISPOZITIV</span>
                                </div>
                                {this.state.nuGasescSerie === "true" && <this.componentaNuGasescImprimanta />}
                            </div>
                        </div>

                        {/* <this.listaOptiuniProbleme /> */}
                        {/* <input onChange={this.handleChange} type="text" className="validatefield2 form-control" id="locatie_magazin" placeholder="Nume Magazin" /> */}
                    </div>
                    <div className="form-group">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-12">
                                    <label id="validatefieldmsg5" className="text-info text-medium" htmlFor="locatie_magazin">*Alege Problema Imprimanta</label>
                                    <this.listaOptiuniProbleme />
                                    {/* <input onChange={this.handleChange} type="text" className="validatefield2 form-control" id="locatie_magazin" placeholder="Nume Magazin" /> */}
                                </div></div>
                            <div className="row">
                                <div className="col-md-9">
                                    <div className="form-group">
                                        <label className="text-info text-small padding-bottom" htmlFor="sesizari_log_problem_description">Introduceti mai multe detalii despre problema:</label>
                                        <br />
                                        <textarea className="form-control" rows="5" id="sesizari_log_problem_description"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <button onSubmit={this.handleSubmit} id="submitBtnRecord" className="btn btn-primary">+ Salveaza Sesizare</button>
                                </div>
                            </div>
                        </div></div>
                </form >
            )
        } else if (this.state.result === "Record Updated") {
            return (
                <div className="alert alert-success">
                    <strong >Sesizare Introdusa cu Succes</strong><br /><br />
                    <button onClick={this.handleBackButton} className="btn btn-primary"><span className="glyphicon glyphicon-ok"></span> Inapoi</button>
                </div>
            )
        } else {
            return (
                <div className="alert alert-danger">
                    Magazinul deja exista<strong > Eroare de sistem!!!Contactati IT</strong><br /><br />
                    <button onClick={this.handleBackButton} className="btn btn-primary"><span className="glyphicon glyphicon-arrow-left"></span> Margeti Inapoi</button>
                </div>
            )
        }
    }

    /// componenta render a clasei
    render() {
        return (
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-md-12 ">
                        <div className="jumbotron"><br />
                            <div className="col-centered">
                                <h1>Introducere Sesizare Noua</h1>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-offset-2 col-md-10">
                                            <this.sesizareComponent />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br /><br /><br /><br />
                        </div>
                    </div>
                </div>
                {this.state.modal_state && <ModalWindow Title={this.state.modal_title} Body={this.state.modal_body} resetState={this.resetState} />}
            </div>
        )
    }
}

export default SesizareProblemaNoua
