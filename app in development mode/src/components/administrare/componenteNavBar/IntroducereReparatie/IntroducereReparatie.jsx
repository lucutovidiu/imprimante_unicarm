import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import "./style.css"
import RenderJobReparatie from './RenderJobReparatie';

class IntroducereReparatie extends Component {

    state = {
        componentTitle: "Introducere Reparatie",
        listaSesizari: [],
        hasUserChoosenSesizare: "",
        printer_select_options: [],
        updateReparatieResult: ""

    }

    setChildEmpty = (currentSelectedSesizare, result) => {
        //    / console.log(updateReparatieResult);
        let listaSesizari = this.state.listaSesizari.filter(item => {
            return item.printer_sn !== currentSelectedSesizare.printer_sn;
        });
        $('#select_sesizare').prop('selected', false).find('option:first').prop('selected', true);
        this.setState({
            ...this.state,
            hasUserChoosenSesizare: "",
            listaSesizari: listaSesizari,
            updateReparatieResult: result.updateReparatieResult
        })
    }
    /*
        listaSesizari:[
            {sesizari_log_id:""},
            {sesizari_log_date:""},
            {store_id:""},
            {printer_id:""},
            {sesizari_log_problem:""},        
            {sesizari_log_problem_description:""},        
            {changed_by:""},
            {printer_brand:""},
            {printer_model:""},
            {printer_sn:""},
            {store_name:""},
            {store_location:""}
        ]
    */
    componentWillMount() {
        this.populateSesizari();
    }
    componentWillUpdate() {
        //console.log(this.state.hasUserChoosenSesizare.split("SN: ")[1].trim());

    }

    componentDidMount() {
    }

    populateSesizari = () => {
        let origin = window.origin;
        axios.post(origin + '/api/Listare', { type: "Listare_Lista_Sesizari_Active" })
            .then((res) => {
                //console.log(res);
                try {
                    const { response } = JSON.parse(res.data);
                    //console.log(store_location);
                    if (response.toString().startsWith("Nu_au_fost_gasite_sesizari_active")) {
                        this.setState({
                            ...this.state,
                            result: "Nu_au_fost_gasite_sesizari_active",
                        })
                    }
                    if (response.toString().startsWith("Listare_Lista_Sesizari_Active")) {
                        const { listaSesizari, printer_select_options } = JSON.parse(res.data);
                        this.setState({
                            ...this.state,
                            result: "SesizariListaAcutualizata",
                            listaSesizari: listaSesizari,
                            printer_select_options: printer_select_options
                        });
                        //console.log(this.state);
                    }
                } catch (e) {
                    console.error(e);
                    $("#submitBtnRecord").text("Conexiune cu baza de date Inexistenta!!");
                    $("#submitBtnRecord").addClass("bg-red");
                }
            });
    }

    // populare state cu sesizari active
    handleAlegeSesizareSelect = (e) => {
        let obj = this.state.listaSesizari.find(item => {
            return item.printer_sn === e.target.value.split("SN: ")[1].trim();
        });
        if (e.target.value.split("SN: ")[1].trim().startsWith("genericSNstoreid")) {
            this.setState({
                ...this.state,
                updateReparatieResult: "",
                hasUserChoosenSesizare: e.target.value,
                serieGenerica: true,
                validateCount: 7,
                currentSelectedSesizare: obj
            });

        } else {
            this.setState({
                ...this.state,
                updateReparatieResult: "",
                hasUserChoosenSesizare: e.target.value,
                serieGenerica: false,
                validateCount: 6,
                currentSelectedSesizare: obj
            });
        }
    }


    selectareSesizare = () => {
        this.updateReparatieResult = "";
        return (
            <select onChange={this.handleAlegeSesizareSelect} id="select_sesizare" defaultValue="Alege o sesizare" className="browser-default">
                <option disabled >Alege o sesizare</option>
                {this.state.listaSesizari.map((item, i) => {
                    return <option key={i}>{item['store_name'] + " - { " + item['printer_brand'] + " - " + item['printer_model'] + " } - SN: " + item['printer_sn']}</option>
                })}
            </select>
        )
    }

    mainComponent = () => {
        //console.log("main:", this.state.updateReparatieResult);
        if (this.state.updateReparatieResult === "" || typeof this.state.updateReparatieResult === "undefined") {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <this.selectareSesizare />
                            {this.state.hasUserChoosenSesizare && <RenderJobReparatie setChildEmpty={this.setChildEmpty} state={Object.assign({}, { ...this.state })} />}
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.updateReparatieResult === "updateOK") {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <this.selectareSesizare /><br />
                            <div className="alert alert-success">
                                <strong >Reparatie efectuata cu Success</strong><br /><br />
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (this.state.updateReparatieResult === "updateNotOK") {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <this.selectareSesizare /><br />
                            <div className="alert alert-success">
                                <strong >Reparatie efectuata cu Success</strong><br /><br />
                            </div>
                        </div>
                    </div>
                </div>

            )
        }

    }


    render() {
        return (
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-md-12 ">
                        <div className="jumbotron">
                            <div className="col-centered"><br />
                                <h1>{this.state.componentTitle}</h1>
                                <this.mainComponent />

                            </div>
                            <br />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default IntroducereReparatie
