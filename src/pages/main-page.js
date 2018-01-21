import React, { Component} from 'react';
import { NavLink } from 'react-router-dom';

import PatienteSearchForm from '../components/patiente-search-form';

class MainPage extends Component {


    render() {
        return (
            <div className="ui three item menu">
                {/*<PatienteSearchForm/>*/}
                <NavLink className="item" activeClassName="active" exact to="/patientes/search">
                    Recherche
                </NavLink>
                <NavLink className="item" activeClassName="active" exact to="/">
                    Liste des patientes
                </NavLink>
                <NavLink className="item" activeClassName="active" exact to="/patientes/new">
                    Ajouter une patiente
                </NavLink>
            </div>
        )
    }
}


export default MainPage;