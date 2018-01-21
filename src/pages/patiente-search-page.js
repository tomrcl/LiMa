import React, { Component} from 'react';
import PatienteSearchForm from '../components/patiente-search-form';


class PatienteSearchPage extends Component {

    render() {
        return (
            <div>
                <h1>Liste des patientes</h1>
                <PatienteSearchForm/>
            </div>
        )
    }
}

export default PatienteSearchPage;