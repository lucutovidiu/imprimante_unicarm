import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery'
import ComponentaVizualizarePerSelectMagazine from './ComponentaVizualizarePerSelectMagazine/ComponentaVizualizarePerSelectMagazine'

class VizualizareIstorieImprimanteMagazin extends Component {
    state = {
        storelist: [],
        type: "General_Listing",
        componentTitle: "Vizualizare Istorie Imprimante / Magazin",
        storelistNameID: [],
        response: ""
    }

    componentWillMount() {
        if (sessionStorage.getItem('user_name') === "" && sessionStorage.getItem('token') === "")
            this.props.history.push('/');

        if (sessionStorage.getItem('role') !== "admin" && sessionStorage.getItem('role') !== "store" && sessionStorage.getItem('role') !== "storeraport")
            this.props.history.push('/');

        this.getStoreList();
    }

    handleAlegeMagazinSelect = (e) => {
        let storeInfo = this.state.storelistNameID.find(item => item.store_name === e.target.value);

        //console.log(storeInfo);
        this.setState({
            viewTableFildsList: ["Data", "Brand Imprimanta", "Model Imprimanta", "Serie Imprimanta", "Notite Imprimanta"],
            sqlTableFildsList: ["printers_history_date", "printer_brand", "printer_model", "printer_sn", "printers_history_notes"],
            sqlcommand: "select prn_his.printers_history_date,prn.printer_brand, prn.printer_model, prn.printer_sn,prn_his.printers_history_notes from printers_history prn_his, printers prn where prn_his.store_id='" + storeInfo.store_id + "' and prn.printer_id=prn_his.printer_id order by prn_his.printers_history_date DESC",
            table_name: "printers",
        });
    }


    getStoreList = () => {
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
                            this.setState({ ...this.state, storelistNameID: [...store_location] });
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




    render() {
        //console.log(this.state);
        return (
            <div>
                {this.state.storelistNameID.length !== 0 && <ComponentaVizualizarePerSelectMagazine state={this.state} handleAlegeMagazinSelect={this.handleAlegeMagazinSelect} />}
            </div>
        )
    }
}

export default VizualizareIstorieImprimanteMagazin
