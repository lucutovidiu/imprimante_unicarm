import React, { Component } from 'react'
import axios from 'axios'
import RenderComponent from './RenderComponent'
import $ from 'jquery'
import "./renderTable.css"

class RenderTableViewDelete extends Component {

    state = {
        type: "",
        viewTableFildsList: [],
        sqlTableFildsList: [],
        sqlcommand: "",
        storelist: [],
        toDeleteList: [],
        table_name: "",
        deleteListIndexBy: "",
        response: ""
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

    postTableRequestedData = (newDelete) => {
        //const newObj = Object.assign({}, { ...this.props.state });
        //this.setState(newObj);
        let origin = window.origin;
        axios.post(origin + '/api/Delete', newDelete)
            .then((res) => {
                //console.log(res);
                let { response } = JSON.parse(res.data);
                if (response === "ok") {
                    const newObjj = Object.assign({}, { ...this.state }, { response });
                    this.setState(newObjj);
                    this.getTableRequestedData();
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
        return <th id={this.props.state.sqlTableFildsList[index]} key={index}>{item}</th>;
    })


    handleClickChange = (e) => {
        //alert($("#tdParent" + e.target.id).hasClass("itemToDelete"));
        let parrentId = "#tdParent" + e.target.id;
        let deleteListIndexBy = $("." + this.state.deleteListIndexBy + e.target.id).text();
        if ($(parrentId).hasClass("itemToDelete")) {
            this.setState({
                ...this.state,
                toDeleteList: this.state.toDeleteList.filter(item => item !== deleteListIndexBy)
            });
            $(parrentId).removeClass("itemToDelete");
        } else {
            this.setState({
                ...this.state,
                toDeleteList: [...this.state.toDeleteList, deleteListIndexBy]
            });
            $(parrentId).addClass("itemToDelete");
        }
        //console.log(this.state);

    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.toDeleteList.length > 0) {
            const newDelete = Object.assign({}, { ...this.state }, { type: "Delete_General" });
            this.postTableRequestedData(newDelete);
        }


    }

    render() {
        return (
            <div className="container-fluid" >
                <div className="row">
                    <div className="col-md-12 col-sm12">
                        <div className="jumbotron"><br />
                            <div className="col-centered">
                                <h1>{this.props.state.componentTitle}</h1>
                                <form onSubmit={this.handleSubmit}>
                                    <table onClick={this.handleClickChange} className="table-responsive table table-bordered table-striped table-hover">
                                        <thead>
                                            <tr>
                                                {this.state.viewTableFildsList.length !== 0 && this.returnTableHeader}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.storelist.length !== 0 && this.state.storelist.map((item, index) => {
                                                    return <RenderComponent key={index} sqlTableFildsList={this.state.sqlTableFildsList} index={index} item={item} />
                                                })
                                            }
                                            <tr><td id="EmptySpan" className="info" colSpan={this.state.viewTableFildsList.length}>Empty</td></tr>
                                        </tbody>
                                    </table><br />
                                    <button onSubmit={this.handleSubmit} className="btn">Sterge Intrari</button>
                                    <br /><br /></form>
                            </div>
                            <br /><br /><br /><br />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RenderTableViewDelete
