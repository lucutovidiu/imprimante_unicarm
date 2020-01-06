import React, { Component } from 'react'
import createProject from '../actions/projectActions'
import { connect } from 'react-redux'
import Projects from './Projects'

class Home extends Component {


    state = {
        id: "",
        name: ""
    }

    handleSubmit = (e) => {
        e.preventDefault();
        //console.log(this.state);
        let project = this.state;
        this.props.createProj(project);
        document.getElementById("id").value = "";
        document.getElementById("name").value = "";
        this.setState({
            id: "",
            name: ""
        })
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    render() {
        return (

            <div className="container margin-top">

                <div className="container">
                    <h1>Create new project</h1>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" id="id" placeholder="ID:" onChange={this.handleChange} /><br></br>
                        <input type="text" id="name" placeholder="Name:" onChange={this.handleChange} /><br></br>
                        <button id="submit" onClick={this.handleSubmit} >Submit</button>
                    </form>
                    <Projects />
                </div>
            </div >
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createProj: (project) => dispatch(createProject(project))
    }
}

export default connect(null, mapDispatchToProps)(Home);
