import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import AdministrareTab from '../componenteNavBar/TabComponents/administrareTab'
import ProblemeImprimanteTab from '../componenteNavBar/TabComponents/ProblemeImprimanteTab'
import RapoarteTab from '../componenteNavBar/TabComponents/RapoarteTab'

const NavBar = (props) => {
  function LoginValidation() {
    if (props.state.credentials.username && props.state.credentials.token && props.state.credentials.role) {
      if (props.state.credentials.role === "admin")
        return (
          <ul className="nav navbar-nav ">
            <AdministrareTab />
            <ProblemeImprimanteTab />
            <RapoarteTab />
          </ul>
        )
      else if (props.state.credentials.role === "storeraport")
        return (<ul className="nav navbar-nav ">
          <ProblemeImprimanteTab />
          <RapoarteTab />
        </ul>)
      else if (props.state.credentials.role === "store")
        return (<ul className="nav navbar-nav "><ProblemeImprimanteTab /></ul>)
      else if (props.state.credentials.role === "raport")
        return (<ul className="nav navbar-nav "><RapoarteTab /></ul>)
    }
    else
      return "";
  }

  const handleLogout = (e) => {
    sessionStorage.clear();
  }

  function CheckLogin() {
    if (props.state.credentials.username && props.state.credentials.token && props.state.credentials.role) {
      return (
        <ul className="nav navbar-nav navbar-right">
          <li><Link to="/" className=""><span className="glyphicon glyphicon-user"></span>&nbsp;<span >{props.state.credentials.username.toUpperCase()}</span></Link></li>
          <li><a onClick={handleLogout} href="/"><span className="glyphicon glyphicon-log-in"></span> &nbsp;Log Out</a></li>
        </ul>)
    } else return (
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="/Login"><span className="glyphicon glyphicon-user"></span> &nbsp;Log In</Link></li></ul>)
  }

  return (
    <nav className="navbar navbar-default padding">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">
            <img src="../img/unicarm_logo.png" className="img img-logo" alt="Unicarm logo" />
            <span className="logo">Unicarm Printer Monitor</span>
          </Link>
        </div>

        <LoginValidation />

        <CheckLogin />

      </div>
    </nav >
  )
}

const mapStateToProps = (state) => {
  return {
    state: state.auth
  }
}


export default connect(mapStateToProps)(NavBar)
