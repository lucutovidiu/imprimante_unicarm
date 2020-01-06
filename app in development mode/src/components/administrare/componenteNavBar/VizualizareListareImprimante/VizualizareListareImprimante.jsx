import React, { Component } from 'react'
// import RenderTableView from '../componentaVizualizareGenerala/RenderTableView'
import RenderTableViewDelete from '../../componenteTemplate/VizualizareGeneralaStergere/RenderTableViewDelete'


class VizualizareListareImprimante extends Component {
    state = {
        type: "General_Listing",
        viewTableFildsList: ["Brand", "Model", "Serie", "Locatie", "Status", "Pret Lista", "Data Instalarii"],
        sqlTableFildsList: ["printer_brand", "printer_model", "printer_sn", "store_name", "printer_status", "printer_list_price", "printer_installed_date"],
        sqlcommand: "select p.printer_brand printer_brand,p.printer_model printer_model,p.printer_sn printer_sn,s.store_name store_name,p.printer_status printer_status,p.printer_list_price printer_list_price,p.printer_installed_date printer_installed_date from printers p, store_info s where p.store_id = s.store_id",
        storelist: [],
        componentTitle: "Listare/Stergere Imprimante",
        table_name: "printers",
        deleteListIndexBy: "printer_sn",
        response: ""
    }

    componentWillMount() {
        if (sessionStorage.getItem('user_name') === "" && sessionStorage.getItem('token') === "")
            this.props.history.push('/');
        if (sessionStorage.getItem('role') !== "admin")
            this.props.history.push('/');
    }


    render() {
        return (
            <div>
                {/* <RenderTableView state={this.state} /> */}
                <RenderTableViewDelete state={this.state} />
            </div>
        )
    }
}

export default VizualizareListareImprimante
