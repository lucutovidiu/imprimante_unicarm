import React, { Component } from 'react'
import axios from 'axios'
import RenderComponent from './RenderComponent'
import $ from 'jquery'
/*
select for getting trace where printers have been to
SELECT (select printer_brand from printers where printer_id=prnHi.printer_id) printer_brand, (select printer_model from printers where printer_id=prnHi.printer_id) printer_model, (select printer_sn from printers where printer_id=prnHi.printer_id) printer_sn, (select store_name from store_info where store_id=prnHi.store_id) store_name,printers_history_date,printers_history_notes FROM printers_history prnHi order by printer_id




*/
class RenderTableView extends Component {

    state = {
        type: "",
        viewTableFildsList: [],
        sqlTableFildsList: [],
        sqlcommand: "",
        storelist: []
    }

    getTableRequestedData = () => {
        const newObj = Object.assign({}, { ...this.props.state });
        //console.log(newObj);
        this.setState(newObj);
        let origin = window.origin;
        axios.post(origin + '/api/Listare', newObj)
            .then((res) => {
                try {
                    // console.log(res);
                    let { response } = JSON.parse(res.data);
                    //console.log(response);
                    if (response === "NoItemsInTheList") {
                        $("#EmptySpan").removeClass("hidden");
                    }

                    if (response === "ok") {
                        $("#EmptySpan").addClass("hidden");
                        let { storelist } = JSON.parse(res.data);
                        //console.log("rerequest");
                        const newObjj = Object.assign({}, { ...this.state }, { storelist: [...storelist] });
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

    componentWillMount() {
        this.getTableRequestedData();

    }
    componentDidUpdate() {
    }

    componentDidMount() {
    }

    returnTableHeader = this.props.state.viewTableFildsList.map((item, index) => {
        return <th key={index}>{item}</th>;
    })

    returnTableBody = this.state.storelist.map((item, index) => {
        return (
            <tr key={index}>
                <th>{item[this.state.sqlTableFildsList[0]]}</th>
                <th>{item[this.state.sqlTableFildsList[1]]}</th>
            </tr>
        )
    })

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

    render() {
        //console.log(this.state);
        return (
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-md-12 ">
                        <div className="jumbotron"><br />
                            <div className="col-centered">
                                <h1>{this.props.state.componentTitle}</h1>
                                <form onSubmit={this.handleSubmit}>
                                    <table className="table table-responsive table-bordered table-striped table-hover">
                                        <thead>
                                            <tr>
                                                {this.state.viewTableFildsList.length !== 0 && this.returnTableHeader}
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

export default RenderTableView
