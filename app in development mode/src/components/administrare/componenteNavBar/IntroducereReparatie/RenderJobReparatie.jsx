import React, { Component } from 'react'
import $ from 'jquery'
import axios from 'axios'
import ModalWindow from '../../ModalComponent/ModalWindow'

class RenderJobReparatie extends Component {

    state = {
        validateCount: 6,
        modal_state: "",
        modal_title: "",
        modal_body: "",
        serieGenerica: false,
        currentSelectedSesizare: {}
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
                //console.log(data)
            });
    }

    // async sendEmail(configEmail) {
    //     //let origin = window.origin;
    // await $.post('http://192.168.0.8:3030/imprimanteunicarm/backend/phpMail/SendMail.php', configEmail)
    //     .done(function (data) {
    //         // alert("Data Loaded: " + data);
    //     });
    // }

    formValidator = () => {
        if ($("#repair_counter").val() === "") $("#repair_counter").val(0);
        let msg = "";
        let allOK = true;
        for (let i = 1; i <= this.state.validateCount; i++) {
            //validatefieldmsg1
            //alert($('.validatefield' + i).is("select"))
            if ($('.validatefield' + i).is("select")) {
                let disabledText = $('.validatefield' + i + ' option[disabled]:selected').val();
                let selectedVal = $('.validatefield' + i).find(":selected").val();
                if (selectedVal === disabledText) {
                    let text = $("#validatefieldmsg" + i).text() + " este Obligatoriu!!!";
                    msg += "<p> " + text + " </p>";
                    allOK = false;
                }
            } else {
                if ($(".validatefield" + i).val().trim() === "") {
                    let text = $("#validatefieldmsg" + i).text() + " este Obligatoriu!!!";
                    msg += "<p> " + text + " </p>";
                    allOK = false;
                }

            }
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

    componentDidMount() {
        //this.setState(Object.assign({}, { ...this.state }, { ...this.props.state }));
    }

    componentWillMount() {
        this.setState(Object.assign({}, { ...this.state }, { ...this.props.state }));
        //console.log("this.state=", this.props.state);
    }

    handleChange = (e) => {
        if (e.target.id === "repair_cost") {
            if (isNaN(e.target.value)) {
                this.validatorPrinterSN("", "Doar cifre sunt admise", "Eroare!!!");
                e.target.value = "";
            }
        }
        if (e.target.id === "repair_counter") {
            if (isNaN(e.target.value)) {
                this.validatorPrinterSN("", "Doar cifre sunt admise", "Eroare!!!");
                e.target.value = "";
            }
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ ...props.state });
        //console.log("prps:S", props);
    }

    introducereReparatieInTabele = (reparatie) => {

        //let store_name = this.state.storelist.find(item => item.store_id === adaugaSesizareInSistem.store_id).store_name;
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
        //console.log(this.state);
        console.log(reparatie);
        let origin = window.origin;
        axios.post(origin + '/api/Updates', reparatie)
            .then((res) => {
                //console.log(res);
                try {
                    const { response } = JSON.parse(res.data);
                    //console.log(store_location);
                    if (response.toString().startsWith("Record Problem")) {
                        this.props.setChildEmpty(this.state.currentSelectedSesizare, { updateReparatieResult: "updateNotOK" });

                    }
                    if (response.toString().startsWith("Record Updated")) {
                        this.props.setChildEmpty(this.state.currentSelectedSesizare, { updateReparatieResult: "updateOK" });
                        let configEmail = {
                            emailMsg: emailMsg,
                            emailSubject: "Reparatie Noua - " + this.state.currentSelectedSesizare.store_name,
                            emailToAddress: "it@unicarm.ro",
                            type: "SesizareNouaEmail"
                        }
                        // console.log(this.configEmail);
                        this.sendEmail(configEmail);
                    }
                } catch (e) {
                    //console.error(e);
                    this.props.setChildEmpty(this.state.currentSelectedSesizare, { updateReparatieResult: "updateNotOK" });
                }
            });
    }
    moment = require('moment');
    handleSubmitReparatie = (e) => {
        e.preventDefault();
        let allOK = this.formValidator();
        //console.log(allOK);

        if (allOK) {
            //let date = "" + (new Date().getFullYear()) + "-" + (new Date().getMonth()) + "-" + (new Date().getDay());

            let dateandtime = this.moment().format('YYYY-MM-DD HH-mm-ss');
            //date = $("#repair_date").val().toString() === "" ? date : $("#repair_date").val().toString();
            let selectedObject = this.state.currentSelectedSesizare;
            let repartieInfo = {
                repair_parts_fitted: $("#repair_parts_fitted").val(),
                repair_counter: $("#repair_counter").val() === "" ? 0 : $("#repair_counter").val(),
                repair_info: $("#repair_info").val(),
                repair_cost: $("#repair_cost").val() === "" ? 0 : $("#repair_cost").val(),
                repair_date: dateandtime,
                printer_status: $("#printer_status").val(),
                type: "IntroducereReparatie",
                sesizari_log_id: selectedObject.sesizari_log_id,
                printer_id: selectedObject.printer_id,
                store_id: selectedObject.store_id,
                printers_history_date: dateandtime,
                changed_by: sessionStorage.getItem('user_name'),
                printer_sn: typeof $("#printer_sn").val() === "undefined" ? "undefined" : $("#printer_sn").val()
            }

            this.introducereReparatieInTabele(repartieInfo);
            //console.log(typeof $("#printer_sn").val() === "undefined" ? "undefined" : $("#printer_sn").val());
        }
    }

    handleAlegeStatusImprimanta = (e) => {

    }

    StatusImprimanta = () => {
        return (
            <select onChange={this.handleAlegeStatusImprimanta} id="printer_status" defaultValue="Reparata - In asteptate de utilizator" className="validatefield6 browser-default">
                <option disabled >Alege Status</option>
                {this.state.printer_select_options.map((item, i) => {
                    return <option key={i}>{item}</option>
                })}
            </select>
        )
    }

    serieImprimanta = () => {
        return (
            <div className="form-group">
                <div className="row">
                    <div className="col-md-4">
                        <label id="validatefieldmsg7" className="text-info text-medium" htmlFor="printer_sn">*Serie Imprimanta</label>
                    </div>
                    <div className="col-md-8">
                        <input onChange={this.handleChange} type="text" className="validatefield7 form-control" id="printer_sn" placeholder="Imprimanta are serie generica Intoduceti seria reala!!!" />
                    </div>
                </div>
            </div>
        )
    }

    render() {
        //console.log("state=", this.state);
        return (
            <div className="container-fluid" >
                <br />
                <div className="row">
                    <div className="col-md-12">
                        <table className="table table-responsive table-bordered table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Sesizarea numarul</th>
                                    <th>Data</th>
                                    <th>Creata De</th>
                                    <th>Magazin</th>
                                    <th>Problema Raportata</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{this.state.currentSelectedSesizare.sesizari_log_id}</td>
                                    <td>{this.state.currentSelectedSesizare.sesizari_log_date}</td>
                                    <td>{this.state.currentSelectedSesizare.changed_by}</td>
                                    <td>{this.state.currentSelectedSesizare.store_name} - {this.state.currentSelectedSesizare.store_location}</td>
                                    <td>{this.state.currentSelectedSesizare.sesizari_log_problem + " - " + this.state.currentSelectedSesizare.sesizari_log_problem_description}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <form onSubmit={this.handleSubmitReparatie}>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label id="validatefieldmsg1" className="text-info text-medium" htmlFor="repair_parts_fitted">*Piese Montate</label>
                                    </div>
                                    <div className="col-md-8">
                                        <input onChange={this.handleChange} type="text" className="validatefield1 form-control" id="repair_parts_fitted" placeholder="ex: x role, 1 printhead etc." />
                                    </div>
                                </div>
                            </div>

                            {this.state.serieGenerica && <this.serieImprimanta />}

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label id="validatefieldmsg2" className="text-info text-medium" htmlFor="repair_info">*Detaliati Reparatia</label>
                                    </div>
                                    <div className="col-md-8">
                                        <input onChange={this.handleChange} type="text" className="validatefield2 form-control" id="repair_info" placeholder="ex: Dispozitiv Resetat, curatat, schimbat piese etc. " />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label id="validatefieldmsg3" className="text-info text-medium" htmlFor="repair_cost">*Cost Reparatie</label>
                                    </div>
                                    <div className="col-md-8">
                                        <input onChange={this.handleChange} type="text" className="validatefield3 form-control" id="repair_cost" placeholder="ex: 0 sau alta suma" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label id="validatefieldmsg4" className="text-info text-medium" htmlFor="repair_counter">*Contor Imprimanta</label>
                                    </div>
                                    <div className="col-md-8">
                                        <input onChange={this.handleChange} type="text" className="validatefield4 form-control" id="repair_counter" placeholder="ex: 0 daca nu se stie" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label id="validatefieldmsg5" className="text-info text-medium" htmlFor="repair_date">*Data Reparatiei</label>
                                    </div>
                                    <div className="col-md-8">
                                        <input onChange={this.handleChange} type="text" className="validatefield5 form-control" id="repair_date" placeholder="Introduceti o noua data cand a fost reparata imprimanta!!!" value={this.moment().format('YYYY-MM-DD HH-mm-ss')} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label id="validatefieldmsg6" className="text-info text-medium" htmlFor="repair_date">*Statusul Actual</label>
                                    </div>
                                    <div className="col-md-8">
                                        <this.StatusImprimanta />
                                    </div>
                                </div>
                            </div>


                            <button className="btn" id="SubmitBtn" onSubmit={this.handleSubmitReparatie}>+ Introduce Reparatia</button>
                        </form>
                    </div>
                </div>
                {this.state.modal_state && <ModalWindow Title={this.state.modal_title} Body={this.state.modal_body} resetState={this.resetState} />}
            </div>
        )
    }

}

export default RenderJobReparatie
