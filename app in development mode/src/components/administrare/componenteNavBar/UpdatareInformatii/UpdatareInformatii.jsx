import React, { Component } from 'react'
// import RenderTableView from '../componentaVizualizareGenerala/RenderTableView'
import ComponentaUpdateGeneral from '../../componenteTemplate/ComponentaUpdateGeneral/ComponentaUpdateGeneral'
import $ from 'jquery'


class UpdatareInformatii extends Component {
    state = {
        type: "General_Listing",
        viewTableFildsList: ["Nume Utilizator", "Role Utilizator", "Parola", "Data Ultima Logare"],
        sqlTableFildsList: ["user_name", "user_role", "user_password", "user_last_login"],
        editableFields: ["user_role", "user_password"],
        sqlcommand: "select user_name,user_role,user_password, user_last_login from printer_users ORDER BY user_name ASC",
        storelist: [],
        table_name: "printer_users",
        deleteListIndexBy: "user_name",
        response: "",
        selected_function: "true",
        suggestionInfoToGetFromTable: ""
    }



    componentWillMount() {
        if (sessionStorage.getItem('user_name') === "" && sessionStorage.getItem('token') === "")
            this.props.history.push('/');
        if (sessionStorage.getItem('role') !== "admin")
            this.props.history.push('/');
    }

    handleChangeSelect = (e) => {
        const selectedOption = $(e.target).val();
        if (selectedOption === "Update Magazin") {
            this.setState({
                ...this.state,
                type: "General_Listing",
                viewTableFildsList: ["Name Magazin", "Locatie Magazin"],
                sqlTableFildsList: ["store_name", "store_location"],
                editableFields: ["store_location"],
                sqlcommand: "select store_name, store_location from store_info ORDER BY store_name ASC",
                storelist: [],
                table_name: "store_info",
                deleteListIndexBy: "store_name",
                response: "",
                selected_function: "true",
                suggestionInfoToGetFromTable: ""
            })
        }

        if (selectedOption === "Update Useri") {
            this.setState({
                ...this.state,
                type: "General_Listing",
                viewTableFildsList: ["Nume Utilizator", "Role Utilizator", "Parola", "Data Ultima Logare"],
                sqlTableFildsList: ["user_name", "user_role", "user_password", "user_last_login"],
                editableFields: ["user_role", "user_password"],
                sqlcommand: "select user_name,user_role,user_password, user_last_login from printer_users ORDER BY user_name ASC",
                storelist: [],
                table_name: "printer_users",
                deleteListIndexBy: "user_name",
                response: "",
                selected_function: "true",
                suggestionInfoToGetFromTable: ""
            })
        }

        if (selectedOption === "Update Imprimante") {
            this.setState({
                ...this.state,
                type: "General_Listing",
                viewTableFildsList: ["Serie", "Brand", "Model", "Locatie", "Status", "Pret Lista", "Data Instalarii"],
                sqlTableFildsList: ["printer_sn", "printer_brand", "printer_model", "store_name", "printer_status", "printer_list_price", "printer_installed_date"],
                editableFields: ["store_name", "printer_status", "printer_list_price", "printer_installed_date"],
                sqlcommand: "select p.printer_brand printer_brand,p.printer_model printer_model,p.printer_sn printer_sn,s.store_name store_name,p.printer_status printer_status,p.printer_list_price printer_list_price,p.printer_installed_date printer_installed_date from printers p, store_info s where p.store_id = s.store_id",
                storelist: [],
                table_name: "printers",
                deleteListIndexBy: "printer_sn",
                response: "",
                selected_function: "true",
                suggestionInfoToGetFromTable: ""
            })
        }

    }

    componentDidUpdate() {
    }

    functionSelect = () => {

        return (
            <div onChange={this.handleChangeSelect.bind(this)} className="container-fluid">
                <div className="row">
                    {/* col-md-offset-3 */}
                    <div className="col-md-4 col-centered margin-top-2rem">
                        <div className="input-field ">
                            <select defaultValue="Update Useri" id="function_select" className="validatefield5 browser-default">
                                <option disabled >Selecteaza o optiune</option>
                                <option >Update Useri</option>
                                <option>Update Magazin</option>
                                <option>Update Imprimante</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div >
        )
    }


    render() {
        //console.log("rerender", this.state);
        return (
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-md-12 col-sm12">
                        <div className="jumbotron"><br />
                            <h3 className="col-centered-h">{this.state.componentTitle}</h3>
                            <this.functionSelect />
                            <ComponentaUpdateGeneral state={Object.assign({}, { ...this.state })} />
                            <br /><br />
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default UpdatareInformatii
