import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import ComponentaVizualizarePerSelectImprimante from './ComponentaVizualizarePerSelectImprimante/ComponentaVizualizarePerSelectMagazine'

class VizualizareReparatiiImprimanta extends Component {
    state = {
        storelist: [],
        type: "General_Listing",
        componentTitle: "Vizualizare Reparatii / Imprimanta",
        printerlistNameID: [],
        response: ""
    }

    componentWillMount() {
        if (sessionStorage.getItem('user_name') === "" && sessionStorage.getItem('token') === "")
            this.props.history.push('/');

        if (sessionStorage.getItem('role') !== "admin" && sessionStorage.getItem('role') !== "store" && sessionStorage.getItem('role') !== "storeraport")
            this.props.history.push('/');

        this.getPrinterList();
    }

    handleAlegeImprimantaSelect = (e) => {
        let prin_id = $("#select_sesizare").find('option:selected').attr('id');

        //console.log();
        this.setState({
            viewTableFildsList: ["Data Reparatie", "Magazin", "Contor Imprimanta", "Piese Montate", "Info Reparatie", "Cost Reparatie"],
            sqlTableFildsList: ["repair_date", "store_name", "repair_counter", "repair_parts_fitted", "repair_info", "repair_cost"],
            sqlcommand: "select prn_rep_log.repair_date,str.store_name, prn_rep_log.repair_counter, prn_rep_log.repair_parts_fitted, prn_rep_log.repair_cost,prn_rep_log.repair_info from printers_repairs_log prn_rep_log, store_info str where printer_id=" + prin_id + " and str.store_id=prn_rep_log.store_id ORDER by prn_rep_log.repair_date desc",
            table_name: "printers",
        });
    }


    getPrinterList = () => {
        const newObj = Object.assign({}, { payload: "NONE" }, { type: "Listare_Imprimante" });

        if (this.state.storelist.length === 0) {
            let origin = window.origin;
            axios.post(origin + '/api/Listare', newObj)
                .then((res) => {
                    //console.log(res)
                    try {
                        const { response, printer_list } = JSON.parse(res.data);
                        //console.log(store_location);
                        if (response === "StoreLocationSugestion") {
                            this.setState({ ...this.state, printerlistNameID: [...printer_list] });
                        }

                        //console.log("axios", printer_list);
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




    render() {
        //console.log(this.state);
        return (
            <div>
                {this.state.printerlistNameID.length !== 0 && <ComponentaVizualizarePerSelectImprimante state={this.state} handleAlegeImprimantaSelect={this.handleAlegeImprimantaSelect} />}
            </div>
        )
    }
}

export default VizualizareReparatiiImprimanta
