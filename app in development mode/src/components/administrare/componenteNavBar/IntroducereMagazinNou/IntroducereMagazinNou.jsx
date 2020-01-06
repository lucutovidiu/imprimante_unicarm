import React, { Component } from 'react'
import $ from 'jquery'
import axios from 'axios'
import ModalWindow from '../../ModalComponent/ModalWindow'
// import updatesAction from '../../../../actions/updatesAction'
// import {connect} from 

/*
-important de pus in clasa unde se doreste a fi introdus modalul
-validateCount: xxx - how many fields you want to validate
--------------------------------------------------------
import $ from 'jquery'
import ModalWindow from '../../ModalComponent/ModalWindow'
--------------------------------------------------------
        validateCount: 2,
        modal_state: "",
        modal_title: "",
        modal_body: ""
--------------------------------------------------------
    resetState = () => {
        this.setState({
            ...this.state,
            modal_state: "",
            modal_title: "",
            modal_body: ""
        })

    }
--------------------------------------------------------

   formValidator = () => {
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
                if ($(".validatefield" + i).val() === "") {
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
--------------------------------------------------------
let allOK = this.formValidator();
        if (allOK) {

        }
--------------------------------------------------------
-add below to last div in component
{this.state.modal_state && <ModalWindow Title={this.state.modal_title} Body={this.state.modal_body} resetState={this.resetState} />}
--------------------------------------------------------

than to form you want to validate add belod id and class
<label id="validatefieldmsg1" className="text-info text-medium" htmlFor="user_name">*Nume User</label>
<input onChange={this.handleChange} type="text" className="validatefield1 form-control" id="user_name" placeholder="Nume Magazin" />

*/

class IntroducereMagazinNou extends Component {
    state = {
        nume_magazin: "",
        locatie_magazin: "",
        result: "",
        validateCount: 2,
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


    formValidator = () => {
        let msg = "";
        let allOK = true;
        for (let i = 1; i <= this.state.validateCount; i++) {
            //validatefieldmsg1
            if ($(".validatefield" + i).val() === "") {
                let text = $("#validatefieldmsg" + i).text() + " este Obligatoriu!!!";
                msg += "<p> " + text + " </p>";
                allOK = false;
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

    handleSubmit = (e) => {
        e.preventDefault();
        let allOK = this.formValidator();
        if (allOK) {
            const newObj = Object.assign({}, { payload: this.state }, { type: "NEW_STORE" });
            var self = this;
            let origin = window.origin;
            axios.post(origin + '/api/Updates', newObj)
                .then((res) => {
                    try {
                        const { response } = JSON.parse(res.data);
                        //console.log(response);
                        if (response === "") {
                            //console.log("inserted exists");
                            let result = "Record Already Exists";
                            self.setState({
                                ...this.state,
                                result
                            })
                            //console.log(self.state);
                        }
                        if (response === '1') {
                            //console.log("inserted record");
                            let result = "Record Updated";
                            self.setState({
                                ...this.state,
                                result
                            })
                            //console.log(self.state);
                        }
                    } catch (e) {
                        $("#submitBtnRecord").text("Conexiune cu baza de date Inexistenta!!");
                        $("#submitBtnRecord").addClass("bg-red");
                    }

                });
        }
    }

    handleBackButton = (e) => {
        let newObj = Object.assign({}, {
            nume_magazin: "",
            locatie_magazin: "",
            result: ""
        });
        this.setState(newObj);
        //console.log(this.state);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    componentWillMount() {
        if (sessionStorage.getItem('user_name') === "" && sessionStorage.getItem('token') === "")
            this.props.history.push('/');
        if (sessionStorage.getItem('role') !== "admin")
            this.props.history.push('/');
    }

    loginComponent = () => {
        if (this.state.result === "") {
            return (
                <form onSubmit={this.handleSubmit} >
                    <div className="form-group">
                        <label id="validatefieldmsg1" className="text-info text-medium" htmlFor="nume_magazin">*Nume Magazin</label>
                        <input onChange={this.handleChange} type="text" className="validatefield1 form-control" id="nume_magazin" placeholder="Nume Magazin" />
                    </div>
                    <div className="form-group">
                        <label id="validatefieldmsg2" className="text-info text-medium" htmlFor="locatie_magazin">*Locatie Magazin</label>
                        <input onChange={this.handleChange} type="text" className="validatefield2 form-control" id="locatie_magazin" placeholder="Nume Magazin" />
                    </div>
                    <button onSubmit={this.handleSubmit} id="submitBtnRecord" className="btn btn-primary">+ Salveaza Magazin</button>
                </form>
            )
        } else if (this.state.result === "Record Updated") {
            return (
                <div className="alert alert-success">
                    <strong >Magazin Introdus cu Succes</strong><br /><br />
                    <button onClick={this.handleBackButton} className="btn btn-primary"><span className="glyphicon glyphicon-ok"></span> Inapoi</button>
                </div>
            )
        } else {
            return (
                <div className="alert alert-danger">
                    Magazinul deja exista<strong > Poate Doriti sa il updatati!!! Atunci sunteti in meniul gresit</strong><br /><br />
                    <button onClick={this.handleBackButton} className="btn btn-primary"><span className="glyphicon glyphicon-arrow-left"></span> Margeti Inapoi</button>
                </div>
            )

        }

    }

    render() {
        return (
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-md-12 ">
                        <div className="jumbotron"><br />
                            <div className="col-centered">
                                <h1>Introducere Magazin Nou</h1><br /><br />
                                <div className="form-width-medium">
                                    <this.loginComponent />
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

export default IntroducereMagazinNou
