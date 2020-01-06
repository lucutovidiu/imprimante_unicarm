import React, { Component } from 'react'
// import RenderTableView from '../componentaVizualizareGenerala/RenderTableView'
import RenderTableViewDelete from '../../componenteTemplate/VizualizareGeneralaStergere/RenderTableViewDelete'



class VizualizareListareMagazine extends Component {
    state = {
        type: "General_Listing",
        viewTableFildsList: ["Name Magazin", "Locatie Magazin"],
        sqlTableFildsList: ["store_name", "store_location"],
        sqlcommand: "select store_name, store_location from store_info ORDER BY store_name ASC",
        storelist: [],
        componentTitle: "Listare/Stergere Magazine",
        table_name: "store_info",
        deleteListIndexBy: "store_name",
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
                <RenderTableViewDelete state={this.state} />
            </div>
        )
    }
}

export default VizualizareListareMagazine
