import React from 'react'

const HigherOrderComponent = (Page) => {
    const pStyle = {
        color: 'green'
    }
    return (props) => {
        return (
            <div style={pStyle}>
                <Page {...props} />
            </div >
        )
    }
}

export default HigherOrderComponent
