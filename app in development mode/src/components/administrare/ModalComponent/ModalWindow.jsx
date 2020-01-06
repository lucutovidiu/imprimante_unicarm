import React, { Component } from 'react'
import './modal.css'
import $ from 'jquery'


/*
-important de pus in clasa unde se doreste a fi introdus modalul
-validateCount: xxx - how many fields you want to validate
--------------------------------------------------------
import $ from 'jquery'
import ModalWindow from '../../ModalComponent/ModalWindow'
--------------------------------------------------------
        validateCount: 2,
        modal_state: "",
        modal_title: "",
        modal_body: ""
--------------------------------------------------------
    resetState = () => {
        this.setState({
            ...this.state,
            modal_state: "",
            modal_title: "",
            modal_body: ""
        })

    }
--------------------------------------------------------

   formValidator = () => {
        let msg = "";
        let allOK = true;
        for (let i = 1; i <= this.state.validateCount; i++) {
            //validatefieldmsg1
            //alert($('.validatefield' + i).is("select"))
            if ($('.validatefield' + i).is("select")) {
                let disabledText = $('.validatefield' + i + ' option[disabled]:selected').val();
                let selectedVal = $('.validatefield' + i).find(":selected").val();
                if (selectedVal === disabledText) {
                    let text = $("#validatefieldmsg" + i).text() + " este Obligatoriu!!!";
                    msg += "<p> " + text + " </p>";
                    allOK = false;
                }
            } else {
                if ($(".validatefield" + i).val() === "") {
                    let text = $("#validatefieldmsg" + i).text() + " este Obligatoriu!!!";
                    msg += "<p> " + text + " </p>";
                    allOK = false;
                }
            }

        }
        if (!allOK) {
            this.setState({
                ...this.state,
                modal_state: "yes",
                modal_title: "Informatii Incorecte!!!",
                modal_body: msg
            })
        }
        return allOK;

    }
--------------------------------------------------------
let allOK = this.formValidator();
        if (allOK) {

        }
--------------------------------------------------------
-add below to last div in component
{this.state.modal_state && <ModalWindow Title={this.state.modal_title} Body={this.state.modal_body} resetState={this.resetState} />}
--------------------------------------------------------

than to form you want to validate add belod id and class
<label id="validatefieldmsg1" className="text-info text-medium" htmlFor="user_name">*Nume User</label>
<input onChange={this.handleChange} type="text" className="validatefield1 form-control" id="user_name" placeholder="Nume Magazin" />

*/

class ModalWindow extends Component {

    componentDidMount() {
        $('.close').on('click', () => {
            $('.overlay').css("visibility", "hidden");
            this.props.resetState();
        })
        $('.btn-ok').on('click', () => {
            $('.overlay').css("visibility", "hidden");
            this.props.resetState();
        })
        $(".content").html(this.props.Body);
    }

    render() {
        return (
            <div>
                <div id="popup1" className="overlay">
                    <div className="popup">
                        <br />
                        <br />
                        <h2>{this.props.Title}</h2>
                        <div className="close" >X</div>
                        <div className="content text-info">
                        </div>
                        <br /><br />
                        <button className="btn-ok btn btn-primary" >OK</button>
                    </div>
                </div>

            </div >
        )
    }
}

export default ModalWindow
