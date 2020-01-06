import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const AdministrareTab = () => {
    return (
        <li className="dropdown" >
            <NavLink className="dropdown-toggle" data-toggle="dropdown" to="/"><span>Administrare</span>&nbsp;<span className="caret"></span></NavLink>
            <ul className="dropdown-menu">
                <li className="dropdown-header allline">Updatare</li>
                <li className="halfSpace"><Link to="/UpdatareInformatii">Updatare Informatii</Link></li>
                <li role="separator" className="divider"></li>
                <li className="dropdown-header allline">Introducere Informatii</li>
                <li className="halfSpace"><Link to="/IntroducereImprimantaNoua" refresh="true">Introducere Imprimanta Noua</Link></li>
                <li className="halfSpace"><Link to="/IntroducereMagazinNou">Introducere Magazin Nou</Link></li>
                <li className="halfSpace"><Link to="/IntroducereUserNou">Introducere User Nou</Link></li>
                <li className="halfSpace"><Link to="/IntroducereReparatie">Introducere Reparatie</Link></li>
                <li role="separator" className="divider"></li>
                <li className="dropdown-header allline">Vizualizare Date</li>
                <li className="allline"><Link to="/VizualizareListareMagazine">Listare/Stergere Magazine</Link></li>
                <li className="allline"><Link to="/VizualizareListareUseri">Listare/Stergere Useri</Link></li>
                <li className="allline"><Link to="/VizualizareListareImprimante">Listare/Stergere Imprimante</Link></li>
            </ul>
        </li >
    )
}

export default AdministrareTab
