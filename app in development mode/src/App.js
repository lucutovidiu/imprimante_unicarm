import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
// import Home from './components/Home.jsx'
import NavBar from './components/administrare/NavBar/NavBar'
import Login from './components/administrare/componenteNavBar/Login/login'
import IntroducereMagazinNou from './components/administrare/componenteNavBar/IntroducereMagazinNou/IntroducereMagazinNou'
import VizualizareListareMagazine from './components/administrare/componenteNavBar/vizualizarelistaremagazine/VizualizareListareMagazine'
import IntroducereImprimantaNoua from './components/administrare/componenteNavBar/IntroducereImprimantaNoua/IntroducereImprimantaNoua'
import './materialize.css'
import IntroducereUserNou from './components/administrare/componenteNavBar/IntroducereUserNou/IntroducereUserNou'
import VizualizareListareImprimante from './components/administrare/componenteNavBar/VizualizareListareImprimante/VizualizareListareImprimante'
import VizualizareListareUseri from './components/administrare/componenteNavBar/VizualizareListareUseri/VizualizareListareUseri'
import UpdatareInformatii from './components/administrare/componenteNavBar/UpdatareInformatii/UpdatareInformatii'
import SesizareProblemaNoua from './components/ProblemeImprimante/SesizareProblemaNoua/SesizareProblemaNoua'
import IntroducereReparatie from './components/administrare/componenteNavBar/IntroducereReparatie/IntroducereReparatie'
import PretReparatiiImprimante from './components/Rapoarte/PretReparatiiImprimante/PretReparatiiImprimante'
import PretReparatiiMagazin from './components/Rapoarte/PretReparatiiMagazin/PretReparatiiMagazin'
import VizualizareIstorieImprimanteMagazin from './components/Rapoarte/VizualizareIstorieImprimanteMagazin/VizualizareImprimanteMagazin'
import VizualizareIstorieImprimante from './components/Rapoarte/VizualizareIstorieImprimante/VizualizareIstorieImprimante'
import VizualizareReparatiiImprimanta from './components/Rapoarte/VizualizareReparatiiImprimanta/VizualizareReparatiiImprimanta'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Switch>
            <Route path="/IntroducereMagazinNou" component={IntroducereMagazinNou} />
            <Route path="/VizualizareListareMagazine" component={VizualizareListareMagazine} />
            <Route path="/IntroducereUserNou" component={IntroducereUserNou} />
            <Route exact path="/Login" component={Login} />
            <Route path="/IntroducereImprimantaNoua" component={IntroducereImprimantaNoua} />
            <Route path="/VizualizareListareUseri" component={VizualizareListareUseri} />
            <Route path="/VizualizareListareImprimante" component={VizualizareListareImprimante} />
            <Route path="/UpdatareInformatii" component={UpdatareInformatii} />
            <Route path="/IntroducereReparatie" component={IntroducereReparatie} />
            <Route path="/SesizareProblemaNoua" component={SesizareProblemaNoua} />
            <Route path="/PretReparatiiImprimante" component={PretReparatiiImprimante} />
            <Route path="/PretReparatiiMagazin" component={PretReparatiiMagazin} />
            <Route path="/VizualizareIstorieImprimanteMagazin" component={VizualizareIstorieImprimanteMagazin} />
            <Route path="/VizualizareIstorieImprimante" component={VizualizareIstorieImprimante} />
            <Route path="/VizualizareReparatiiImprimanta" component={VizualizareReparatiiImprimanta} />
            {/* <Route path="/:post_id" component={Projects} /> */}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

