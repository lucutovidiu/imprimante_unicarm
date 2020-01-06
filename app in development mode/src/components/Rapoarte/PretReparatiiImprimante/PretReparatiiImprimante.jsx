import React, { Component } from 'react'
import RenderTableView from '../../administrare/componenteTemplate/componentaVizualizareGenerala/RenderTableView'

class PretReparatiiImprimante extends Component {
    state = {
        type: "General_Listing",
        viewTableFildsList: ["Brand", "Model", "Serie", "Total Cost Reparatie", "Pret Lista"],
        sqlTableFildsList: ["printer_brand", "printer_model", "printer_sn", "repair_cost", "printer_list_price"],
        sqlcommand: "SELECT printer_brand,printer_model,printer_sn,IFNUll((select SUM(repair_cost) from printers_repairs_log WHERE printer_id=prn.printer_id),0) repair_cost,IFNUll(printer_list_price,0) printer_list_price from printers prn order by repair_cost desc",
        storelist: [],
        componentTitle: "Pret Reparatii / Imprimante",
        table_name: "printers",
        deleteListIndexBy: "printer_sn",
        response: ""
    }
    componentWillMount() {
        if (sessionStorage.getItem('user_name') === "" && sessionStorage.getItem('token') === "")
            this.props.history.push('/');

        if (sessionStorage.getItem('role') !== "admin" && sessionStorage.getItem('role') !== "store" && sessionStorage.getItem('role') !== "storeraport")
            this.props.history.push('/');
    }

    render() {
        return (
            <div>
                <RenderTableView state={this.state} />
            </div>
        )
    }
}

export default PretReparatiiImprimante
