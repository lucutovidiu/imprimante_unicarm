import React, { Component } from 'react'
import './Login.css'
import { connect } from 'react-redux'
import authValidateAction from '../../../../actions/authValidateAction'

class Login extends Component {
    state = {
        username: "", password: ""
    }

    handleSubmit = (e) => {
        e.preventDefault();
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        this.props.sendAuth(Object.assign({}, this.state));
        //console.log(this.state)
    }

    componentWillMount() {
        if (this.props.state.token !== "") this.props.history.push('/');
    }
    componentDidUpdate() {
        if (this.props.state.token !== "") this.props.history.push('/');
    }


    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleClose = (e) => {
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="loginpopup">
                <div className="wrapper-login">
                    <div className="x" onClick={this.handleClose}>X</div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input type="text" className="form-control login-form-control" id="username" placeholder="User" onChange={this.handleChange} />
                            <label className="labelControl" htmlFor="username" >User</label>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control login-form-control" id="password" placeholder="Parola" onChange={this.handleChange} />
                            <label className="labelControl" htmlFor="password" >Parola</label>
                        </div>
                        <div className="form-group">
                            <div className="center">
                                <button type="submit" className="btn btn-default" onClick={this.handleSubmit}>Login</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div >
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        sendAuth: (state) => dispatch(authValidateAction(state))
    }
}

const mapStateToProps = state => {
    return {
        state: state.auth.credentials
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);


