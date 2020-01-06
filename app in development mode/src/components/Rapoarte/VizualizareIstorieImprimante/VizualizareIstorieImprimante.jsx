import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import ComponentaVizualizarePerSelectImprimante from './ComponentaVizualizarePerSelectImprimante/ComponentaVizualizarePerSelectMagazine'

class VizualizareIstorieImprimante extends Component {
    state = {
        storelist: [],
        type: "General_Listing",
        componentTitle: "Vizualizare Istorie Imprimante",
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
            viewTableFildsList: ["Data", "Magazin", "Brand Imprimanta", "Model Imprimanta", "Serie Imprimanta", "Notite Imprimanta"],
            sqlTableFildsList: ["printers_history_date", "store_name", "printer_brand", "printer_model", "printer_sn", "printers_history_notes"],
            sqlcommand: "select prn_his.printers_history_date,stor.store_name,prn.printer_brand, prn.printer_model, prn.printer_sn,prn_his.printers_history_notes from printers_history prn_his, printers prn,store_info stor where prn_his.printer_id=prn.printer_id and prn_his.printer_id=" + prin_id + " and stor.store_id=prn_his.store_id order by prn_his.printers_history_date DESC",
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

                        // console.log("axios", printer_list);
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




    render() {
        //console.log(this.state);
        return (
            <div>
                {this.state.printerlistNameID.length !== 0 && <ComponentaVizualizarePerSelectImprimante state={this.state} handleAlegeImprimantaSelect={this.handleAlegeImprimantaSelect} />}
            </div>
        )
    }
}

export default VizualizareIstorieImprimante
