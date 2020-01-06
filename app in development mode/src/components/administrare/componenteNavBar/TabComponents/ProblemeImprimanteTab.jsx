import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const ProblemeImprimanteTab = () => {
    return (
        <li className="dropdown">
            <NavLink className="dropdown-toggle" data-toggle="dropdown" to="/"><span>Probleme Imprimante</span>&nbsp;<span className="caret"></span></NavLink>
            <ul className="dropdown-menu bold">
                <li className="dropdown-header allline">Sesizeaza o problema</li>
                <li><Link to="/SesizareProblemaNoua">Sesizare Problema Noua</Link></li>
            </ul>
        </li>
    )
}

export default ProblemeImprimanteTab
