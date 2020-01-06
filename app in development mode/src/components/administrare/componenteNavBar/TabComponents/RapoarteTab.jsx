import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const RapoarteTab = () => {
    return (
        <li className="dropdown">
            <NavLink className="dropdown-toggle" data-toggle="dropdown" to="/"><span>Rapoarte</span>&nbsp;<span className="caret"></span></NavLink>
            <ul className="dropdown-menu bold">
                <li className="dropdown-header allline">Vizializare Rapoarte</li>
                <li className="allline"><Link to="/PretReparatiiImprimante">Pret reparatii / imprimante</Link></li>
                <li className="allline"><Link to="/PretReparatiiMagazin">Pret reparatii / magazin</Link></li>
                <li className="allline"><Link to="/VizualizareIstorieImprimanteMagazin">Vizualizare Istoric Imprimante / Magazin</Link></li>
                <li className="allline"><Link to="/VizualizareIstorieImprimante">Vizualizare Istoric Imprimante</Link></li>
                <li className="allline"><Link to="/VizualizareReparatiiImprimanta">Vizualizare Reparatii / Imprimanta</Link></li>
            </ul>
        </li>
    )
}

export default RapoarteTab
