import React, { Component } from 'react'
import axios from 'axios'
import RenderComponent from '../../../administrare/componenteTemplate/componentaVizualizareGenerala/RenderComponent'
import $ from 'jquery'
/*
select for getting trace where printers have been to
SELECT (select printer_brand from printers where printer_id=prnHi.printer_id) printer_brand, (select printer_model from printers where printer_id=prnHi.printer_id) printer_model, (select printer_sn from printers where printer_id=prnHi.printer_id) printer_sn, (select store_name from store_info where store_id=prnHi.store_id) store_name,printers_history_date,printers_history_notes FROM printers_history prnHi order by printer_id

*/
class ComponentaVizualizarePerSelectMagazine extends Component {

    state = {
        type: "",
        viewTableFildsList: [],
        sqlTableFildsList: [],
        sqlcommand: "",
        storelist: [],
        storelistNameID: []
    }

    componentWillMount() {

    }

    getTableRequestedData = (nextProps) => {
        const newObj = Object.assign({}, { ...nextProps.state });
        //console.log(newObj.sqlcommand);
        //this.setState(nextProps.state);
        let origin = window.origin;
        axios.post(origin + '/api/Listare', newObj)
            .then((res) => {
                try {
                    //console.log("res=", res);
                    let { response } = JSON.parse(res.data);
                    //console.log(response);
                    if (response === "NoItemsInTheList") {
                        $("#EmptySpan").removeClass("hidden");
                        const newObjj = Object.assign({}, { ...nextProps.state }, { storelist: [] });
                        //console.log(newObjj);
                        this.setState(newObjj);
                    }

                    if (response === "ok") {
                        $("#EmptySpan").addClass("hidden");
                        let { storelist } = JSON.parse(res.data);
                        //console.log("rerequest");
                        const newObjj = Object.assign({}, { ...nextProps.state }, { storelist: [...storelist] });
                        //console.log(newObjj);
                        this.setState(newObjj);
                        //console.log("json", newObjj);
                    }
                } catch (e) {
                    $("#EmptySpan").text("Conexiune cu baza de date Inexistenta!!");
                    $("#EmptySpan").addClass("bg-red");
                    $("#EmptySpan").removeClass("hidden");
                }
            });
    }

    componentDidUpdate() {
    }

    componentDidMount() {
    }

    returnTableBody = () => {
        this.state.storelist.map((item, index) => {
            return (
                <tr key={index}>
                    <th>{item[this.state.sqlTableFildsList[0]]}</th>
                    <th>{item[this.state.sqlTableFildsList[1]]}</th>
                </tr>
            )
        })
    }

    handleClick = (e) => {
        this.forceUpdate();
    }

    handleSubmit = (e) => {
        e.preventDefault();

    }

    convertToCSV = () => {
        let array = "[{";
        for (let j = 0; j < this.state.sqlTableFildsList.length; j++) {
            let list = this.state.sqlTableFildsList[j];
            //console.log(list);
            array += JSON.stringify(list) + ":" + JSON.stringify(list) + ",";
        }
        array = array.substring(0, array.length - 1);
        array = array + "}]";
        array = [...JSON.parse(array), ...this.state.storelist];
        let csv = array.map(function (d) {
            return JSON.stringify(Object.values(d));
        })
            .join('\n')
            .replace(/(^\[)|(\]$)/mg, '');
        let a = document.createElement("a");
        a.href = 'data:attachment/csv,' + csv;
        a.target = "_Blank";
        a.download = this.props.state.componentTitle.replace(/(^\[)|(\]$)/mg, '') + ".csv";
        document.body.appendChild(a);
        a.click();
    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
        if (nextProps.sqlcommand !== "") this.getTableRequestedData(nextProps);
    }

    selectareSesizare = () => {
        this.updateReparatieResult = "";
        return (
            <select onChange={this.props.handleAlegeMagazinSelect} id="select_sesizare" defaultValue="Alege Un Magazin" className="browser-default">
                <option disabled >Alege Un Magazin</option>
                {this.props.state.storelistNameID.map((item, i) => {
                    return <option key={i}>{item["store_name"]}</option>
                })}
            </select>
        )
    }

    render() {
        //console.log("render comp", this.state);
        return (
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-md-12 ">
                        <div className="jumbotron"><br />
                            <div className="col-centered">
                                <h1>{this.props.state.componentTitle}</h1>
                                <div className="row">
                                    <this.selectareSesizare />
                                </div>

                                <form onSubmit={this.handleSubmit}>
                                    <table className="table table-responsive table-bordered table-striped table-hover">
                                        <thead>
                                            <tr>
                                                {this.state.viewTableFildsList.length !== 0 && this.state.viewTableFildsList.map((item, index) => {
                                                    return <th key={index}>{item}</th>;
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.storelist.length !== 0 && this.state.storelist.map((item, index) => {
                                                    return <RenderComponent key={index} index={index} item={item} sqlTableFildsList={this.props.state.sqlTableFildsList} />
                                                })
                                            }
                                            <tr><td id="EmptySpan" className="info" colSpan={this.state.viewTableFildsList.length}>Empty</td></tr>
                                        </tbody>
                                    </table>
                                    <button onClick={this.convertToCSV} id="downloadCSV" className="btn btn-primary">Print To CSV</button>
                                </form>

                            </div>
                            <br /><br /><br /><br />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ComponentaVizualizarePerSelectMagazine
