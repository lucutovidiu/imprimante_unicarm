import React from 'react'

const RenderComponent = (props) => {

    return (

        <tr id={"tdParent" + props.index} className="SuggestionBoxParent">
            {props.sqlTableFildsList.map((indexitem, index) => {
                if (props.editableFields.find(item => item === props.sqlTableFildsList[index])) {
                    if (props.sqlTableFildsList[index] === "user_password") {
                        return <td key={index}><input onBlur={props.handleBlur} onFocus={props.handleFocus} onChange={props.handleTypeChange} type="password" className={"form-control smallText cursor"} id={props.sqlTableFildsList[index] + props.index} placeholder="Apasa pentru a schimba parola" />
                        </td>
                    } else
                        return <td key={index}>
                            <input onBlur={props.handleBlur} onFocus={props.handleFocus} onChange={props.handleTypeChange} type="text" className={"form-control smallText"} id={props.sqlTableFildsList[index] + props.index} placeholder={props.item[indexitem]} />
                            <div id={"SuggestionBox" + props.index} className="SuggestionBox hidden cursor"></div>
                        </td>

                }
                return <td id={props.index} className={props.sqlTableFildsList[index] + props.index + " cursor"} key={index}>{props.item[indexitem]}</td>
            })}
        </tr>
    )
}


export default RenderComponent
