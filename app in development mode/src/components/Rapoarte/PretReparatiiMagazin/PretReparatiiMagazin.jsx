import React, { Component } from 'react'
import RenderTableView from '../../administrare/componenteTemplate/componentaVizualizareGenerala/RenderTableView'

class PretReparatiiMagazin extends Component {
    state = {
        type: "General_Listing",
        viewTableFildsList: ["Nume Magazin", "Locatie Magazin", "Total Cost Reparatii Imprimante"],
        sqlTableFildsList: ["store_name", "store_location", "repair_cost"],
        sqlcommand: "select store_name , store_location, IFNULL((select sum(repair_cost) from printers_repairs_log where store_id=st_info.store_id),0) repair_cost from store_info st_info order by repair_cost desc",
        storelist: [],
        componentTitle: "Pret Reparatii / Magazin",
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

export default PretReparatiiMagazin
