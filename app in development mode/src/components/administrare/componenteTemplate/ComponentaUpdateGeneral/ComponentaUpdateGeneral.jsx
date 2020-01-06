import React, { Component } from 'react'
import axios from 'axios'
import RenderComponent from './RenderComponent'
import "./renderTable.css"
import $ from 'jquery'

class ComponentaUpdateGeneral extends Component {

    state = {
        type: "",
        viewTableFildsList: [],
        sqlTableFildsList: [],
        editableFields: [],
        sqlcommand: "",
        storelist: [],
        storelistMap: [],
        toDeleteList: [],
        table_name: "",
        deleteListIndexBy: "",
        response: "",
        changedInfo: []
    }


    jsonTable = [];
    suggestionInfoToGetFromTable = [];
    suggestionInfoUserUpdate = ["admin", "raport", "store", "storeraport"];
    suggestionInfoUpdateImprimante = {
        store_location: [],
        printer_status: []
    };
    sqlCommandToUpdateRecords = [];
    sqlCommandToUpdateHistory = [];

    getOptionsList = () => {
        const newObj = Object.assign({}, { type: "Listare_Optiuni_Imprimanta" });
        let origin = window.origin;
        axios.post(origin + '/api/Listare', newObj)
            .then((res) => {
                try {
                    //console.log(res);
                    let { response } = JSON.parse(res.data);
                    //console.log(response);
                    if (response === "ListaOptiuniImprimanta") {
                        $("#submitBtnRecord").text("Inregistraza Modificari");
                        $("#submitBtnRecord").removeClass("disabled");
                        $("#submitBtnRecord").removeClass("bg-red");
                        let { optiuniImprimanta } = JSON.parse(res.data);
                        this.suggestionInfoUpdateImprimante = Object.assign({}, { ...this.suggestionInfoUpdateImprimante }, { printer_status: optiuniImprimanta.map(item => item.option_name) });
                        this.setState({ ...this.state });
                    }

                } catch (e) {
                    //console.error(e);
                    $("#submitBtnRecord").text("Conexiune cu baza de date Inexistenta!!");
                    $("#submitBtnRecord").addClass("bg-red");
                }
            });
    }

    UpdateSqlRecords = () => {
        let origin = window.origin;
        axios.post(origin + '/api/Updates', this.sqlCommandToUpdateRecords[0])
            .then((res) => {
                //console.log(res);

                try {
                    const { response } = JSON.parse(res.data);
                    //console.log(JSON.stringify(request[0]));
                    if (response === "") {
                        $("#tdParent" + this.sqlCommandToUpdateRecords[0].rowAffected).after("<span class='infoFail'>Inregistrare Nereusita</span>");
                        //console.log(self.state);
                    }
                    if (response === '1') {
                        //console.log(self.state);
                        $("#tdParent" + this.sqlCommandToUpdateRecords[0].rowAffected).after("<span class='infoSuccess'>Inregistrare Reusita</span>");
                        //trimite email la magazin
                    }
                    this.sqlCommandToUpdateRecords = this.sqlCommandToUpdateRecords.filter(item => item !== this.sqlCommandToUpdateRecords[0]);

                    if (typeof this.sqlCommandToUpdateRecords[0] !== "undefined") {
                        //console.log("tdParent" + request[0].rowAffected + " SuggestionBoxParent::after");
                        this.UpdateSqlRecords(this.sqlCommandToUpdateRecords[0]);
                    } else {
                        if (typeof this.sqlCommandToUpdateHistory.storeChanges[0] !== "undefined") {
                            setTimeout(() => {
                                this.updateHistory();
                            }, 800);
                        } else {
                            $("#submitBtnRecord").text("Inregistraza Modificari");
                            $("#submitBtnRecord").removeClass("disabled");
                            $("#submitBtnRecord").removeClass("bg-red");
                            setTimeout(() => {
                                this.getTableRequestedData(this.state);
                                this.resetFieldsInfo();
                            }, 8000);
                        }
                    }

                } catch (e) {
                    //$("#tdParent" + this.sqlCommandToUpdateRecords[0].rowAffected).after("<span class='infoFail'>Inregistrare Nereusita</span>");
                    $("#submitBtnRecord").addClass("bg-red");
                    $("#submitBtnRecord").text("Conexiune cu baza de date Inexistenta!!");
                    setTimeout(() => {
                        this.getTableRequestedData(this.state);
                        this.resetFieldsInfo();
                    }, 8000);
                }

            });
    }

    updateHistory = () => {
        if (typeof this.sqlCommandToUpdateHistory.storeChanges[0] !== "undefined") {
            //console.log("to update histody:", this.sqlCommandToUpdateHistory.storeChanges[0]);
            let origin = window.origin;
            axios.post(origin + '/api/Updates', Object.assign({}, { storeChanges: [this.sqlCommandToUpdateHistory.storeChanges[0]] }, { type: "STORE_USER_STATUS_CHANGE" }))
                .then((res) => {
                    //console.log(res);
                    try {
                        const { response } = JSON.parse(res.data);
                        if (response === "") {
                            //$("#tdParent" + this.sqlCommandToUpdateRecords[0].rowAffected).after("<span class='infoFail'>Inregistrare Nereusita</span>");
                        }
                        if (response === '1') {
                            //console.log("updated : ", this.sqlCommandToUpdateHistory.storeChanges[0]);
                            //$("#tdParent" + this.sqlCommandToUpdateRecords[0].rowAffected).after("<span class='infoSuccess'>Inregistrare Reusita</span>");
                        }
                        //console.log("before", this.sqlCommandToUpdateHistory);
                        this.sqlCommandToUpdateHistory = Object.assign({}, {
                            storeChanges: this.sqlCommandToUpdateHistory.storeChanges.filter(item => {
                                return item !== this.sqlCommandToUpdateHistory.storeChanges[0];
                            })
                        });


                        //console.log("left=", this.sqlCommandToUpdateHistory);
                        if (typeof this.sqlCommandToUpdateHistory.storeChanges[0] !== "undefined") {
                            this.updateHistory();
                        } else {
                            $("#submitBtnRecord").text("Inregistraza Modificari");
                            $("#submitBtnRecord").removeClass("disabled");
                            $("#submitBtnRecord").removeClass("bg-red");
                            setTimeout(() => {
                                this.getTableRequestedData(this.state);
                                this.resetFieldsInfo();
                            }, 8000);
                            //console.log("history updatea finished");
                        }
                    } catch (e) {
                        //console.error(e);
                    }
                }).catch(err => {
                    // console.error(err);
                });

        } else {
        }


    }



    getSuggestionInfo = (request) => {
        let origin = window.origin;
        axios.post(origin + '/api/Listare', request)
            .then((res) => {
                //console.log(res.data);
                try {

                    let { response } = JSON.parse(res.data);
                    //console.log("printers", "json", res.data);
                    if (response === "StoreLocationSugestion") {
                        let { store_location } = JSON.parse(res.data);
                        let parsedStore_location = store_location.map(item => {
                            return item.store_name
                        })
                        //console.log("am intrat si aici");
                        //const newObjj = Object.assign({}, { ...this.state }, { storelist: [...storelist] });
                        //this.setState(newObjj);
                        this.suggestionInfoUpdateImprimante = Object.assign({}, { ...this.suggestionInfoUpdateImprimante }, { store_location: [...parsedStore_location] }, { storelistMap: [...store_location] });
                        this.suggestionInfoToGetFromTable = Object.assign({}, { store_location: [...parsedStore_location] });
                        //this.suggestionInfoUpdateImprimante = Object.assign({}, { store_location: [...parsedStore_location] });
                        //console.log(this.suggestionInfoUpdateImprimante);
                        //console.log(this.suggestionInfoToGetFromTable);
                    }
                } catch (e) {
                    $("#submitBtnRecord").text("Conexiune cu baza de date Inexistenta!!");
                    // $("#submitBtnRecord").addClass("disabled");
                    $("#submitBtnRecord").addClass("bg-red");
                }

            });
    }

    getTableRequestedData = (nextProps) => {
        //console.log("before", nextProps);
        let origin = window.origin;
        axios.post(origin + '/api/Listare', nextProps)
            .then((res) => {
                // console.log("rerequest");
                //console.log("after", res.data);
                try {
                    let { response } = JSON.parse(res.data);
                    //console.log(response);
                    if (response === "NoItemsInTheList") {
                        $("#EmptySpan").removeClass("hidden");
                    }
                    //console.log("props", nextProps);
                    if (response === "ok") {
                        $("#EmptySpan").addClass("hidden");
                        let { storelist } = JSON.parse(res.data);
                        const newObjj = Object.assign({}, { ...nextProps }, { storelist: [...storelist] });

                        if (nextProps.table_name === "store_info") {
                            //console.log("store_info", this.newObjj);
                            //console.log("store_info t", this.suggestionInfoUpdateImprimante.store_location);
                            this.suggestionInfoToGetFromTable = Object.assign({}, { store_location: newObjj.storelist.map(item => { return item.store_location }) });
                            this.suggestionInfoUpdateImprimante = Object.assign({}, { ...this.suggestionInfoUpdateImprimante }, { store_location: newObjj.storelist.map(item => { return item.store_location }) });
                            //this.suggestionInfoUpdateImprimante = Object.assign({}, { ...this.suggestionInfoUpdateImprimante }, { store_location: [...parsedStore_location] }, { storelistMap: [...store_location] });
                            //this.suggestionInfoToGetFromTable = newObjj.storelist.map(item => { return item.store_location });
                            //console.log(this.suggestionInfoUpdateImprimante.store_location);
                            //this.getSuggestionInfo(Object.assign({}, { type: "Listare_Magazine" }));
                            //this.suggestionInfoUpdateImprimante = Object.assign({}, { ...this.suggestionInfoUpdateImprimante }, { store_list: this.suggestionInfoToGetFromTable });

                        }

                        if (nextProps.table_name === "printers") {

                            this.getSuggestionInfo(Object.assign({}, { type: "Listare_Magazine" }));
                        }

                        this.getOptionsList();
                        this.setState(newObjj);

                    }

                } catch (e) {
                    $("#submitBtnRecord").text("Conexiune cu baza de date Inexistenta!!");
                    //  $("#submitBtnRecord").addClass("disabled");
                    $("#submitBtnRecord").addClass("bg-red");
                }
            });
    }

    componentWillReceiveProps(nextProps) {
        //this.getOptionsList();
        this.setState(Object.assign({}, { ...this.state, ...nextProps.state }));
        this.getTableRequestedData(Object.assign({}, { ...this.state, ...nextProps.state }));

    }

    postTableRequestedData = (newDelete) => {
        let origin = window.origin;
        axios.post(origin + '/api/Delete', newDelete)
            .then((res) => {
                let { response } = JSON.parse(res.data);
                if (response === "ok") {
                    const newObjj = Object.assign({}, { ...this.state }, { response });
                    this.setState(newObjj);
                    this.getTableRequestedData();
                }

            });
    }

    componentWillMount() {
        this.getTableRequestedData(this.props.state);
        //this.getSuggestionInfo(Object.assign({}, { type: "Listare_Magazine" }));
        // var test = "UPDATE printers SET store_id='1',printer_status='Trimisa la Magazin' where printer_sn='test2'";
        // var regex = /.*store_id='{1}'.*printer_status='Trimisa la Magazin'/g;
        // var found = test.match(regex);
        // //console.log(found);
    }

    componentDidUpdate() {

    }

    componentWillUpdate() {
        $("span").remove(".infoSuccess");
        $("span").remove(".infoFail");
        // this.getTableRequestedData();
    }
    /*
    changedInfo:[
        {
            store_name:"",
            store_location:""
        },
        {
            store_name:"",
            store_location:""
        }
     
    ]
    */
    resetFieldsInfoBtn = (e) => {
        this.resetFieldsInfo();
    }
    resetFieldsInfo() {
        for (let i = 0; i < this.state.editableFields.length; i++) {
            for (let j = 0; j < this.state.storelist.length; j++) {
                let fields = this.state.editableFields[i] + "" + j;
                $("#" + fields).val("");
            }
        }
        $(".SuggestionBox").html("");
    }

    //.borderIncorectInfo
    handleSubmit = (e) => {
        e.preventDefault();


        let testOK = true;

        //console.log(this.suggestionInfoUpdateImprimante);

        for (let i = 0; i < this.state.editableFields.length; i++) {
            for (let j = 0; j < this.state.storelist.length; j++) {
                let fields = this.state.editableFields[i] + "" + j;
                let value = $("#" + fields).val();
                if ((typeof value !== "undefined") && value !== "") {

                    let currentValue = $("#" + fields).attr('placeholder');

                    if (fields.includes("store_name") || fields.includes("store_location")) {
                        let testresult = this.suggestionInfoUpdateImprimante.store_location.find(item => item === value);
                        //console.log("res", this.suggestionInfoUpdateImprimante.store_location);
                        if (typeof testresult === "undefined") {
                            //$("#" + fields).val("");
                            $("#" + fields).css("background-color", "rgba(170, 57, 57, 0.726)");
                            let sBox = "#SuggestionBox" + j;
                            $(sBox).removeClass("hidden");
                            $(sBox).html("<span class='errorMsgSuggestionBox'>Erroare!! Locatie Inexistenta!!! Introduceti locatie noua sau introduceti una corecta</div>");
                            testOK = false;
                        } else
                            if (currentValue.trim().toUpperCase() === testresult.toUpperCase()) {
                                $("#" + fields).css("background-color", "rgba(170, 57, 57, 0.726)");
                                let sBox = "#SuggestionBox" + j;
                                $(sBox).removeClass("hidden");
                                $(sBox).html("<span class='errorMsgSuggestionBox'>Erroare!! Ati introdus Acceasi Locatie deja existenta!!!</div>");
                                testOK = false;
                            }

                    } else
                        if (fields.includes("printer_status")) {
                            let testresult = this.suggestionInfoUpdateImprimante.printer_status.find(item => item === value);
                            if (typeof testresult === "undefined") {
                                // $("#" + fields).val("");
                                $("#" + fields).css("background-color", "rgba(170, 57, 57, 0.726)");
                                let sBox = "#SuggestionBox" + j;
                                //console.log(sBox);
                                $(sBox).removeClass("hidden");
                                $(sBox).html("<div class='errorMsgSuggestionBox'>Erroare!! Status inexistent doar statusurile de mai jos sunt admise: " + this.suggestionInfoUpdateImprimante.printer_status + "</div>");
                                testOK = false;
                            } else
                                if (currentValue.trim().toUpperCase() === testresult.toUpperCase()) {
                                    $("#" + fields).css("background-color", "rgba(170, 57, 57, 0.726)");
                                    let sBox = "#SuggestionBox" + j;
                                    $(sBox).removeClass("hidden");
                                    $(sBox).html("<span class='errorMsgSuggestionBox'>Erroare!! Ati introdus acelasi status deja existent!!!</div>");
                                    testOK = false;
                                }
                        } else
                            if (fields.includes("printer_list_price")) {
                                if (!parseInt(value, 10)) {
                                    //$("#" + fields).val("");
                                    $("#" + fields).css("background-color", "rgba(170, 57, 57, 0.726)");
                                    let sBox = "#SuggestionBox" + j;
                                    $(sBox).removeClass("hidden");
                                    $(sBox).html("<div class='errorMsgSuggestionBox'>Erroare!! DoarNumere sunt admise!! </div>");
                                    testOK = false;
                                } else
                                    if (currentValue.trim() === value) {
                                        $("#" + fields).css("background-color", "rgba(170, 57, 57, 0.726)");
                                        let sBox = "#SuggestionBox" + j;
                                        $(sBox).removeClass("hidden");
                                        $(sBox).html("<span class='errorMsgSuggestionBox'>Erroare!! Ati introdus acelasi deja existent!!!</div>");
                                        testOK = false;
                                    }

                            } else
                                if (fields.includes("printer_installed_date")) {
                                    let date = new Date(value);
                                    if (date.toString() === "Invalid Date") {
                                        $("#" + fields).css("background-color", "rgba(170, 57, 57, 0.726)");
                                        let sBox = "#SuggestionBox" + j;
                                        $(sBox).removeClass("hidden");
                                        $(sBox).html("<div class='errorMsgSuggestionBox'>Erroare!! Data Invalida YYYY-MM-DD</div>");
                                        testOK = false;
                                    } else
                                        if (currentValue.trim() === value) {
                                            $("#" + fields).css("background-color", "rgba(170, 57, 57, 0.726)");
                                            let sBox = "#SuggestionBox" + j;
                                            $(sBox).removeClass("hidden");
                                            $(sBox).html("<span class='errorMsgSuggestionBox'>Erroare!! Ati introdus Acceasi data deja existenta!!!</div>");
                                            testOK = false;
                                        }
                                }
                                else if (fields.includes("user_role")) {
                                    //console.log(this.suggestionInfoUserUpdate);
                                    let testresult = this.suggestionInfoUserUpdate.find(item => item === value);
                                    if (typeof testresult === "undefined") {
                                        // $("#" + fields).val("");
                                        $("#" + fields).css("background-color", "rgba(170, 57, 57, 0.726)");
                                        let sBox = "#SuggestionBox" + j;
                                        $(sBox).removeClass("hidden");
                                        $(sBox).html("<div class='errorMsgSuggestionBox'>Erroare!! Role Negasit in system!! Utizizati role din lista de mai jos:" + this.suggestionInfoUserUpdate + "</div>");
                                        testOK = false;
                                    } else
                                        if (currentValue.trim().toUpperCase() === testresult.toUpperCase()) {
                                            $("#" + fields).css("background-color", "rgba(170, 57, 57, 0.726)");
                                            let sBox = "#SuggestionBox" + j;
                                            $(sBox).removeClass("hidden");
                                            $(sBox).html("<span class='errorMsgSuggestionBox'>Erroare!! Ati introdus role deja existent!!!</div>");
                                            testOK = false;
                                        }
                                }
                }
            }
        }



        if (testOK) {
            let finalTable = [];
            //console.log("am inasdasdasdasdas");
            //json and sql parsing from inputs of --- json for update imprimante for location and staus only
            let json = "";
            let updateSql = "", store_name = "", existingStoreName = "", existingPrinterStatus = "", printer_status = "";
            let historyChange = false;

            for (let i = 0; i < this.state.storelist.length; i++) {
                let temp = "", temp2 = "";
                existingPrinterStatus = "";
                printer_status = "";
                store_name = "";
                existingStoreName = "";
                for (let j = 0; j < this.state.editableFields.length; j++) {

                    let val = $("#" + this.state.editableFields[j] + "" + i).val();
                    let val2 = val;
                    //convertesc store_name in store_id pt baza de date
                    if (val.trim() !== "") {
                        let storeConvert = "";

                        if (this.state.editableFields[j] === "printer_status") {
                            historyChange = true;
                            printer_status = val2;
                            existingPrinterStatus = $("#" + this.state.editableFields[j] + "" + i).attr("placeholder");
                            temp2 += `"${this.state.editableFields[j]}":"${val}",`;
                            if ($("#store_name" + i).val() === "") {
                                val2 = this.suggestionInfoUpdateImprimante.storelistMap.filter(item => {
                                    return item.store_name === $("#store_name" + i).attr("placeholder");
                                });
                                val2 = val2[0].store_id;
                                temp2 += `"store_name":"${val2}",`;
                            }
                        }

                        if (this.state.editableFields[j] === "store_name") {
                            historyChange = true;
                            store_name = val;
                            existingStoreName = $("#" + this.state.editableFields[j] + "" + i).attr("placeholder");
                            storeConvert = "store_id";
                            val = this.suggestionInfoUpdateImprimante.storelistMap.filter(item => {
                                return item.store_name === val;
                            });
                            val2 = this.suggestionInfoUpdateImprimante.storelistMap.filter(item => {
                                return item.store_name === val2;
                            });
                            val = val[0].store_id;
                            val2 = val2[0].store_id;
                            temp += `"${storeConvert}":"${val}",`;
                            temp2 += `"store_name":"${val2}",`;
                        }
                        else {
                            storeConvert = this.state.editableFields[j];
                        }
                        temp += `"store_name":"${val}",`;
                        //temp2 += `"store_name":"${val2}",`;
                        updateSql += "" + storeConvert + "='" + val + "',";
                    }
                }
                if (temp.length > 1) {
                    if (historyChange) {
                        historyChange = false;
                        let key = `{"${this.state.deleteListIndexBy}":"${$('#' + i).text()}",`
                        temp = temp.substring(0, temp.length - 1);
                        temp2 = temp2.substring(0, temp2.length - 1);
                        json += key + temp2;
                        //console.log("status: ", printer_status, "nume: ", store_name);                

                        if (printer_status.trim() === "") {
                            json += ',"changed_by":"' + sessionStorage.getItem('user_name') + '","printers_history_notes":"Imprimanta trimisa de la Locatie: <' + existingStoreName + '> la Locatie: <' + store_name + '>"},';
                        } else if (store_name.trim() === "") {
                            json += ',"changed_by":"' + sessionStorage.getItem('user_name') + '","printers_history_notes":"Status Updatat de la: <' + existingPrinterStatus + '> la: <' + printer_status + '>"},';
                        } else if (printer_status.trim() !== "" && store_name.trim() !== "") {
                            json += ',"changed_by":"' + sessionStorage.getItem('user_name') + '","printers_history_notes":"Imprimanta a fost trimisa de la: <' + existingStoreName + '> La: <' + store_name + '> si statusul modificat de La: <' + existingPrinterStatus + '> La: <' + printer_status + '>"},';
                        }
                    }
                    else {
                        //json += "},";
                    }
                    updateSql = updateSql.substring(0, updateSql.length - 1);
                    finalTable = [...finalTable, i];
                    updateSql += " where " + this.state.deleteListIndexBy + "='" + $('#' + i).text() + "'$";
                }
            }
            updateSql = updateSql.substring(0, updateSql.length - 1);

            //console.log("json=", json);

            if (json.length > 5) {
                json = "[" + json.substring(0, json.length - 1) + "]";
                json = '{"storeChanges":' + json + ',"type":"STORE_USER_STATUS_CHANGE"}';
                let jsonTable = JSON.parse(json);
                this.sqlCommandToUpdateHistory = Object.assign({}, jsonTable);
                //console.log(this.sqlCommandToUpdateHistory);
                //this.updateHistory();
            }



            //console.log(jsonTable);
            // tablehistory = jsonTable.map(item => {
            //     let date = new Date().toISOString().slice(0, 10) + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
            //     let sql = "INSERT INTO " + this.state.table_name + "("
            //     if ((typeof item.store_id !== "undefined") && (typeof item.printer_status !== "undefined")) {
            //         let sql = `INSERT INTO printers_history ( printers_history_date, printers_history_notes,"
            //         "changed_by,store_id,printer_id) VALUES ('${date}','Imprimanta trimisa de la Locatie: la Locatie: ',
            //         ${sessionStorage.getItem('user_name')},${item.store_id},${})`
            //     }

            //     if (typeof item.printer_status !== "undefined")
            //         ps = item.printer_status;

            // })

            //"UPDATE " + this.state.table_name + " SET " + 
            //console.log("i=", finalTable);
            let sqlUpdatesList = updateSql.trim().split("$").map((item, index) => {
                let sqlCommand = ("UPDATE " + this.state.table_name + " SET " + item).toString();
                return Object.assign({}, { sqlCommand: sqlCommand, rowAffected: finalTable[index], type: "UPDATE_GENERAL" });
            })
            //console.log(sqlUpdatesList);
            this.sqlCommandToUpdateRecords = [...sqlUpdatesList];
            $("#submitBtnRecord").addClass("disabled");
            this.UpdateSqlRecords();
            this.sendTrimisaLaMagazinEmail(JSON.parse(json));
        }
        //
    }

    emailTemplate = ({ changed_by, store_name, printer_brand, printer_model }) => {
        let emailMsg = `
        <html>
        <head>
        <title>Sezizare Noua</title>
        </head>
        <body>
        <br/><br/>
        &nbsp;&nbsp;&nbsp;<h3>Imprimanta Trimisa.</h3>
        <br/><br/>
        <table width="auto" border="0" cellspacing="3" cellpadding="6" style="border:1px solid #ccc;">
           <tr ><th>Creat De</th>
           <td style="border-bottom:1px solid #ccc;">${changed_by}</td>
           </tr>
           <tr ><th>Nume Magazin</th>
           <td style="border-bottom:1px solid #ccc;">${store_name}</td>
           </tr>
           <tr><th>Printer Brand</th>
           <td style="border-bottom:1px solid #ccc;">${printer_brand}</td>
           </tr>
           <tr><th>Printer Model</th>
           <td style="border-bottom:1px solid #ccc;">${printer_model}</td>
           </tr>
           <tr><th>Notite</th>
           <td>Imprimanta in curs de trimitere</td>
           </tr>           
            </table>
            <br/> <br/>

            Cu respect,<br/>&nbsp;&nbsp;&nbsp;&nbsp;Echipa Imprimante Unicarm
            </body>
            </html>
        `;
        return emailMsg;
    }

    sendEmail = (configEmail) => {
        let origin = window.origin;
        //console.log("email to send: " + configEmail);
        axios.post(origin + '/api/SendMail', configEmail)
            .then(function (data) {
                //  console.log(data)
            });
    }

    // async sendEmail(configEmail) {
    //     // let emailmag = { ...configEmail, emailToAddress: configEmail.emailToAddress + "," + configEmail.store_name + "@unicarm.ro" };
    //     // console.log("email to send: ", emailmag);
    //     //let origin = window.origin;
    //     await $.post('http://192.168.0.8:3030/imprimanteunicarm/backend/phpMail/SendMail.php', configEmail).done((data) => {
    //         console.log("email response", data);
    //     });
    // }

    sendTrimisaLaMagazinEmail({ storeChanges }) {
        let emailList = [];
        //console.log(storeChanges);
        // console.log(this.suggestionInfoUpdateImprimante);
        storeChanges.forEach(item => {
            if (item.printer_status === "Trimisa la Magazin") {
                emailList.push(
                    {
                        changed_by: item.changed_by,
                        printer_brand: this.state.storelist.find(store => store.printer_sn === item.printer_sn).printer_brand,
                        printer_model: this.state.storelist.find(store => store.printer_sn === item.printer_sn).printer_model,
                        store_name: this.suggestionInfoUpdateImprimante.storelistMap.find(store => store.store_id === item.store_name).store_name
                    }
                )
            }
        });

        if (emailList.length !== 0) {
            emailList.forEach(item => {
                let template = this.emailTemplate(item);
                let configEmail = {
                    emailMsg: template,
                    emailSubject: "Imprimtanta in curs de trimitere catre - " + item.store_name,
                    emailToAddress: "it@unicarm.ro," + item.store_name + "@unicarm.ro",
                    type: "SesizareNouaEmail",
                    store_name: item.store_name
                }
                this.sendEmail(configEmail);
            })
        }

    }

    handleFocus = (e) => {
        $("#" + e.target.id).val("");
        $("#" + e.target.id).css("background-color", "white");
        let tid = "" + e.target.id;
        let index = tid.substring(tid.length - 1, tid.length);
        let sBox = "#SuggestionBox" + index;
        $(sBox).addClass("hidden");
        $(sBox).html("");
    }

    handleBlur = (e) => {
        // console.log(e.target.id);
        let tid = "" + e.target.id;
        let index = tid.substring(tid.length - 1, tid.length);
        let sBox = "#" + e.target.id + "+#SuggestionBox" + index;
        let suggesteVal = $(sBox).text();
        if (suggesteVal.length > 1 && !suggesteVal.trim().includes("Erroare"))
            e.target.value = suggesteVal;
        $(sBox).addClass("hidden");

    }


    handleTypeChange = (e) => {
        //$("#" + e.target.id).css("background-color", "white");
        //let tid = "" + e.target.id;
        //let index = tid.substring(tid.length - 1, tid.length);
        //let sBox = "#SuggestionBox" + index;
        //$(sBox).addClass("hidden");
        //$(sBox).html("");


        if (this.state.table_name === "store_info") {
            let tid = "" + e.target.id;
            let index = tid.substring(tid.length - 1, tid.length);
            let sBox = "#SuggestionBox" + index;
            let inputVal = e.target.value;
            $(sBox).html("");
            if (e.target.value.length >= 1) {
                let sulist = this.suggestionInfoToGetFromTable.store_location.filter((item, index) => {
                    return item.toString().toUpperCase().startsWith(inputVal.toUpperCase());
                }).map(item => {
                    return "<p class='handleChangeSuggestion'>" + item + "</p>";
                });

                if ((typeof sulist[0] !== "undefined")) {
                    if (sulist[0].length > 2) {
                        $(sBox).removeClass("hidden");
                        $(sBox).html(sulist[0]);
                    }
                } else {
                    $(sBox).html("");
                    $(sBox).addClass("hidden");
                }
            } else {
                $(sBox).addClass("hidden");
            }
        } else if (this.state.table_name === "printer_users") {

            if (e.target.id.toString().startsWith("user_role")) {
                let tid = "" + e.target.id;
                let index = tid.substring(tid.length - 1, tid.length);
                let sBox = "#SuggestionBox" + index;
                let inputVal = e.target.value;
                $(sBox).html("");
                if (e.target.value.length >= 1) {
                    let sulist = this.suggestionInfoUserUpdate.filter((item, index) => {
                        return item.toString().toUpperCase().startsWith(inputVal.toUpperCase());
                    }).map(item => {
                        return "<p class='handleChangeSuggestion'>" + item + "</p>";
                    });

                    if ((typeof sulist[0] !== "undefined")) {
                        if (sulist[0].length > 2) {
                            $(sBox).removeClass("hidden");
                            $(sBox).html(sulist[0]);
                        }
                    } else {
                        $(sBox).html("");
                        $(sBox).addClass("hidden");
                    }
                } else {
                    $(sBox).addClass("hidden");
                }
            }
        } else if (this.state.table_name === "printers") {

            if (e.target.id.toString().startsWith("printer_status")) {
                let tid = "" + e.target.id;
                let index = tid.substring(tid.length - 1, tid.length);
                let sBox = "#printer_status" + index + "+#SuggestionBox" + index;
                //console.log(sBox);
                let inputVal = e.target.value;
                $(sBox).html("");
                if (e.target.value.length >= 1) {
                    let sulist = this.suggestionInfoUpdateImprimante.printer_status.filter((item, index) => {
                        return item.toString().toUpperCase().startsWith(inputVal.toUpperCase());
                    }).map(item => {
                        return "<p class='handleChangeSuggestion'>" + item + "</p>";
                    });

                    if ((typeof sulist[0] !== "undefined")) {
                        if (sulist[0].length > 2) {
                            $(sBox).removeClass("hidden");
                            $(sBox).html(sulist[0]);
                        }
                    } else {
                        $(sBox).html("");
                        $(sBox).addClass("hidden");
                    }
                } else {
                    $(sBox).addClass("hidden");
                }
            } else if (e.target.id.toString().startsWith("store_name")) {
                let tid = "" + e.target.id;
                let index = tid.substring(tid.length - 1, tid.length);
                let sBox = "#SuggestionBox" + index;
                let inputVal = e.target.value;
                $(sBox).html("");
                if (e.target.value.length >= 1) {
                    let sulist = this.suggestionInfoUpdateImprimante.store_location.filter((item, index) => {
                        return item.toString().toUpperCase().startsWith(inputVal.toUpperCase());
                    }).map(item => {
                        return "<p class='handleChangeSuggestion'>" + item + "</p>";
                    });

                    if ((typeof sulist[0] !== "undefined")) {
                        if (sulist[0].length > 2) {
                            $(sBox).removeClass("hidden");
                            $(sBox).html(sulist[0]);
                        }
                    } else {
                        $(sBox).html("");
                        $(sBox).addClass("hidden");
                    }
                } else {
                    $(sBox).addClass("hidden");
                }
            }

        }

    }

    componentDidMount() {

    }

    returnTableHeader = this.props.state.viewTableFildsList.map((item, index) => {
        return <th id={this.props.state.sqlTableFildsList[index]} key={index}>{item}</th>;
    })


    handleClickChange = (e) => {
    }

    render() {
        return (
            <div className="container-fluid fadeincontainer">
                <div className="row fadein">
                    <form onSubmit={this.handleSubmit}>
                        <table className="table table-bordered table-striped table-responsive table-hover">
                            <thead>
                                <tr>
                                    {this.state.viewTableFildsList.length !== 0 && this.state.viewTableFildsList.map((item, index) => {
                                        return <th id={this.state.sqlTableFildsList[index]} key={index}>{item}</th>;
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.storelist.length !== 0 && this.state.storelist.map((item, index) => {
                                        return <RenderComponent key={index} handleFocus={this.handleFocus} handleBlur={this.handleBlur} handleTypeChange={this.handleTypeChange} editableFields={this.state.editableFields} sqlTableFildsList={this.state.sqlTableFildsList} index={index} item={item} />
                                    })
                                }
                                <tr><td id="EmptySpan" className="info" colSpan={this.state.viewTableFildsList.length}>Empty</td></tr>
                            </tbody>
                        </table><br />
                        <button onSubmit={this.handleSubmit} id="submitBtnRecord" className="btn">Inregistraza Modificari</button>
                        &nbsp;&nbsp; <span onClick={this.resetFieldsInfoBtn} className="btn btn-danger btn-bg-reg">Reseteaza Campuri</span>
                        <br /><br /></form>

                </div>
            </div>
        )
    }
}

export default ComponentaUpdateGeneral
