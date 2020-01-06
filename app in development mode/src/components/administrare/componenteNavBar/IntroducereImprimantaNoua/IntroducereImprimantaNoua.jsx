import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import ModalWindow from '../../ModalComponent/ModalWindow'

class IntroducereImprimantaNoua extends Component {
    state = {
        storelist: [

        ],
        locatie_magazin: "",
        result: "",
        date: "",
        modal_state: "",
        modal_title: "",
        modal_body: "",
        validateCount: 5
    }

    resetState = () => {
        this.setState({
            ...this.state,
            modal_state: "",
            modal_title: "",
            modal_body: ""
        })

    }

    ListaOptiuniStatusImprimante = [];

    getOptionsList = () => {
        const newObj = Object.assign({}, { type: "Listare_Optiuni_Imprimanta" });
        let origin = window.origin;
        axios.post(origin + '/api/Listare', newObj)
            .then((res) => {
                try {
                    //console.log(res);
                    let { response } = JSON.parse(res.data);
                    //console.log(response);
                    if (response === "ListaOptiuniImprimanta") {
                        let { optiuniImprimanta } = JSON.parse(res.data);
                        this.ListaOptiuniStatusImprimante = [...optiuniImprimanta];
                        //console.log(this.ListaOptiuniStatusImprimante);
                        this.resetState();
                    }

                } catch (e) {
                    //console.error(e);
                    $("#submitBtnRecord").text("Conexiune cu baza de date Inexistenta!!");
                    $("#submitBtnRecord").addClass("bg-red");
                }
            });
    }

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

    handleSubmit = (e) => {
        e.preventDefault();
        //console.log(this.state)
        let allOK = this.formValidator();
        if (allOK) {
            let printer_brand = $('#printer_brand').val();
            let printer_model = $('#printer_model').val();
            let printer_sn = $('#printer_sn').val();
            let store_id_name = $('#store_id_name').val();
            let printer_status = $('#printer_status').val();
            let printer_list_price = $('#printer_list_price').val();
            let printer_installed_date = $('#printer_installed_date').val();
            let user_name = sessionStorage.getItem("user_name");
            let payload = {
                printer_brand: printer_brand,
                printer_model: printer_model,
                printer_sn: printer_sn,
                store_id_name: store_id_name,
                printer_status: printer_status,
                printer_list_price: printer_list_price,
                printer_installed_date: printer_installed_date,
                changed_by: user_name
            }

            const newObj = Object.assign({}, { payload }, { type: "NEW_PRINTER" });
            var self = this;
            let origin = window.origin;
            axios.post(origin + '/api/Updates', newObj)
                .then((res) => {
                    //console.log(res);
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
    }

    handleChange = (e) => {

    }


    componentDidMount() {
        this.getOptionsList();
    }

    datepicker = () => {

        return (
            <div className="container-fluid">
                <input className="form-control" id="printer_installed_date" placeholder="YYYY/MM/DD" type="date" />
            </div>

        )
    }

    componentWillMount() {

        if (sessionStorage.getItem('user_name') === "" && sessionStorage.getItem('token') === "")
            this.props.history.push('/');
        if (sessionStorage.getItem('role') !== "admin")
            this.props.history.push('/');

        const newObj = Object.assign({}, { payload: "NONE" }, { type: "Listare_Magazine" });

        if (this.state.storelist.length === 0) {
            let origin = window.origin;
            axios.post(origin + '/api/Listare', newObj)
                .then((res) => {
                    //console.log(res)
                    try {
                        const { response, store_location } = JSON.parse(res.data);
                        //console.log(store_location);
                        if (response === "StoreLocationSugestion") {
                            this.setState({ ...this.state, storelist: [...store_location] });
                        }

                        // console.log("axios", self.state);
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

    storeModal = () => {
        return (
            <div className="container-fluid">
                <div className="input-field col s12 m6">
                    <select id="store_id_name" defaultValue="Magazine" className="validatefield4 browser-default">
                        <option disabled >Magazine</option>
                        {this.state.storelist.map((item, i) => {
                            return <option key={i}>{item['store_name']}</option>
                        })}
                    </select>
                </div>
            </div>
        )
    }

    stareImprimanta = () => {
        return (
            <div className="container-fluid">

                <div className="input-field col s12 m6">
                    <select id="printer_status" defaultValue="Selecteaza o optiune" className="validatefield5 browser-default">
                        <option disabled >Selecteaza o optiune</option>
                        {this.ListaOptiuniStatusImprimante.map((item, index) => <option key={index}>{item.option_name}</option>)}
                    </select>
                </div>
            </div >
        )
    }



    loginComponent = () => {
        if (this.state.result === "") {
            return (
                <form onSubmit={this.handleSubmit} >
                    <div className="form-group">
                        <label id="validatefieldmsg1" className="text-medium text-danger" htmlFor="printer_brand">*Brand Imprimanta</label>
                        <input type="text" className="validatefield1 form-control" id="printer_brand" placeholder="Brand Imprimanta" />
                    </div>
                    <div className="form-group">
                        <label id="validatefieldmsg2" className="text-medium text-danger" htmlFor="printer_model">*Model Imprimanta</label>
                        <input type="text" className="validatefield2 form-control" id="printer_model" placeholder="Model Imprimanta" />
                    </div>
                    <div className="form-group">
                        <label id="validatefieldmsg3" className="text-medium text-danger" htmlFor="printer_sn">*Serie Imprimanta</label>
                        <input type="text" className="validatefield3 form-control" id="printer_sn" placeholder="Serie Imprimanta" />
                    </div>
                    <div className="form-group">
                        <label id="validatefieldmsg4" className="text-medium text-danger" >*De ce magazin apartine?</label><br />
                        <this.storeModal />
                        {/* <input onChange={this.handleChange} data-toggle="modal" data-target="#myModal" type="text" className="form-control" id="store_id" placeholder="De ce magazin apartine?" /> */}
                    </div>
                    <div className="form-group">
                        <label id="validatefieldmsg5" className="text-medium text-danger" >*Status Imprimanta (eg: "Noua In Depozit" pt prima data)</label>
                        <this.stareImprimanta />
                        {/* <input onChange={this.handleChange} type="text" className="form-control" id="printer_status" placeholder="Status Imprimanta" /> */}
                    </div>
                    <div className="form-group">
                        <label className="text-medium text-info" htmlFor="printer_list_price">Pret de Magazin</label>
                        <input onChange={this.handleChange} type="text" className="form-control" id="printer_list_price" placeholder="Pret de Magazin" />
                    </div>
                    <div className="form-group">
                        <label className="text-medium text-info" htmlFor="printer_installed_date">Data Instalarii</label>

                        <this.datepicker />
                        {/* <input onChange={this.handleChange} type="text" className="form-control" id="printer_installed_date" placeholder="Data Instalarii" /> */}
                    </div>
                    <button onSubmit={this.handleSubmit} id="submitBtnRecord" className="btn btn-primary">+ Salveaza Imprimanta</button>

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
                    Imprimanta deja existenta in sistem, sau conexiune cu baza de date indexistenta!!<strong> Contactati IT</strong><br /><br />
                    <button onClick={this.handleBackButton} className="btn btn-primary"><span className="glyphicon glyphicon-arrow-left"></span> Margeti Inapoi</button>
                </div>
            )
        }

    }

    render() {

        return (
            < div className="container-fluid" >
                <div className="row">
                    <div className="col-md-12 ">
                        <div className="jumbotron"><br />
                            <div className="col-centered">
                                <h1>Introducere Imprimanta Noua</h1>
                                <div className="form-width-large">
                                    <this.loginComponent />
                                </div>
                            </div>
                            <br /><br /><br /><br />
                        </div>
                    </div>
                </div>
                {this.state.modal_state && <ModalWindow Title={this.state.modal_title} Body={this.state.modal_body} resetState={this.resetState} />}
            </div >
        )
    }
}

export default IntroducereImprimantaNoua
