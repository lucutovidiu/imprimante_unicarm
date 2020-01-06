import React, { Component } from 'react'
import { connect } from 'react-redux'

class Projects extends Component {
    state = {
        id: "",
        name: "Ovi"
    }

    // componentDidMount() {
    //     let id = this.props.match.params.post_id;
    //     this.setState({
    //         ...this.state,
    //         id: id
    //     })
    // }
    render() {
        //console.log("test;", this.props);
        console.log("localstorage user name:", localStorage.username);
        console.log("session  user name:", sessionStorage.username);
        const proj = this.props.projects.map(project => {
            return (
                <div className="wrapper margin-top container" key={project.id}>
                    <p className="title">title : {project.id}</p>
                    <p>my name is : {project.name}</p>
                </div>
            )
        })
        return (proj)

    }
}

const mapStateToProps = (state) => {
    return {
        projects: state.project.projects
    }
}

export default connect(mapStateToProps)(Projects)
