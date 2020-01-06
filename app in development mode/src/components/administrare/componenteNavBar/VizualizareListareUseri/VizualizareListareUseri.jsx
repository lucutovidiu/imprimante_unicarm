import React, { Component } from 'react'
// import RenderTableView from '../componentaVizualizareGenerala/RenderTableView'
import RenderTableViewDelete from '../../componenteTemplate/VizualizareGeneralaStergere/RenderTableViewDelete'


class VizualizareListareUseri extends Component {
    state = {
        type: "General_Listing",
        viewTableFildsList: ["Nume Utilizator", "Role Utilizator", "Data Ultima Logare"],
        sqlTableFildsList: ["user_name", "user_role", "user_last_login"],
        sqlcommand: "select user_name, user_role,user_last_login from printer_users ORDER BY user_name ASC",
        storelist: [],
        componentTitle: "Listare/Stergere Useri",
        table_name: "printer_users",
        deleteListIndexBy: "user_name",
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

export default VizualizareListareUseri 
