import React from 'react'
import HigherOrderComponent from './higherOrderComponent'
// import { Redirect } from 'react-router-dom'
// import Home from './Home'

const Contact = () => {
    //if (localStorage.username !== "G3") return <Redirect to={Home} />
    return (
        <div className="jumbotron">
            <div className="container">
                {/* <h1 className="btn btn-primary">This is Contact page</h1> */}
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="well">Test1</div>
                        </div>
                        <div className="col-md-6 hidden-sm hidden-xs">
                            <div className="well">Test2</div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-6 col-sm-push-6">
                            <div className="well">Test3</div>
                        </div>

                        <div className="col-sm-6 col-sm-pull-6">
                            <div className="well">Test4</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default HigherOrderComponent(Contact)
