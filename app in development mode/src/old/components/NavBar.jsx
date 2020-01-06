import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'

const NavBar = (props) => {
  return (
    // <div>
    //   <ul >
    // <li><Link to="/">Home</Link></li>
    // <li><NavLink to="/project">Projects</NavLink></li>
    // <li><NavLink to="/Contact">Contact</NavLink></li>
    //   </ul>
    // </div>

    <nav className="navbar navbar-default navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to="/" className="navbar-brand">Ovi's Website Design</Link>
        </div>
        <ul className="nav navbar-nav">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/project">Projects</NavLink></li>
          <li><NavLink to="/Contact">Contact</NavLink></li>

          <li className="dropdown">
            <NavLink className="dropdown-toggle" data-toggle="dropdown" to="/"><span>Administrare</span>&nbsp;<span className="caret"></span></NavLink>
            <ul className="dropdown-menu bold">
              <li class="dropdown-header">Updatare</li>
              <li><Link to="/">Updatare Informatii</Link></li>
              <li><Link to="/">Updatare Status Imprimanta</Link></li>
              <li role="separator" class="divider"></li>
              <li class="dropdown-header">Introducere Informatii</li>
              <li><Link to="/">Introducere Imprimanta Noua</Link></li>
              <li><Link to="/">Introducere Magazin Nou</Link></li>
              <li><Link to="/">Introducere User Nou</Link></li>
              <li><Link to="/">Introducere Reparatie</Link></li>
              <li role="separator" class="divider"></li>
              <li class="dropdown-header">Vizualizare Date</li>
              <li><Link to="/">Vizualizare Listare Magazine</Link></li>
              <li><Link to="/">Vizualizare Listare Useri</Link></li>
              <li><Link to="/">Vizualizare Listare Imprimante</Link></li>
            </ul>
          </li>

          <li className="dropdown">
            <NavLink className="dropdown-toggle" data-toggle="dropdown" to="/"><span>Probleme Imprimante</span>&nbsp;<span className="caret"></span></NavLink>
            <ul className="dropdown-menu bold">
              <li class="dropdown-header">Sesizeaza o problema</li>
              <li><Link to="/">Sesizare Problema Noua</Link></li>
              <li><Link to="/">Anulare Sesizare</Link></li>
            </ul>
          </li>

          <li className="dropdown">
            <NavLink className="dropdown-toggle" data-toggle="dropdown" to="/"><span>Rapoarte</span>&nbsp;<span className="caret"></span></NavLink>
            <ul className="dropdown-menu bold">
              <li class="dropdown-header">Vizializare Rapoarte</li>
              <li><Link to="/">Pret reparatii per imprimante</Link></li>
              <li><Link to="/">Unde a fost imprimanta pana acuma</Link></li>
              <li><Link to="/">Un magazin ce imprimante a avut pana acuma</Link></li>
              <li><Link to="/">Un magazin ce probleme a avut la imprimante</Link></li>
              <li><Link to="/">Pret reparatii per magazin</Link></li>
              <li><Link to="/">Istorie reparatii imprimante </Link></li>
              <li><Link to="/">Ce probleme a avut imprimanta pana acuma</Link></li>
            </ul>
          </li>

        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li><a ><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
          <li><Link to="/Login"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
        </ul>
      </div>
    </nav>

  )
}

export default withRouter(NavBar)
