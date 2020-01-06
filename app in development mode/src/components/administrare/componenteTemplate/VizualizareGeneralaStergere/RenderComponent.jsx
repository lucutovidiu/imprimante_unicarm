import React from 'react'

const RenderComponent = (props) => {

    return (
        <tr id={"tdParent" + props.index}>
            {props.sqlTableFildsList.map((indexitem, index) => {
                return <td id={props.index} className={props.sqlTableFildsList[index] + props.index + " cursor"} key={index}>{props.item[indexitem]}</td>
            })}
        </tr>
    )
}


export default RenderComponent
