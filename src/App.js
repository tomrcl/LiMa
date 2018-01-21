import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import MainPage from './pages/main-page';
import PatienteListPage from './pages/patiente-list-page';
import PatienteFormPage from './pages/patiente-form-page';
import PatienteViewPage from './pages/patiente-view-page';
import PatienteSearchPage from './pages/patiente-search-page';

class App extends Component {
    render() {
        return (
            <Container>
                <Route component={MainPage}/>
                <Route exact path="/" component={PatienteListPage}/>
                <Route path="/patientes/search" component={PatienteSearchPage}/>
                <Route path="/patientes/new" component={PatienteFormPage}/>
                <Route path="/patientes/edit/:_id" component={PatienteFormPage}/>
                <Route path="/patientes/view/:_id" component={PatienteViewPage}/>
            </Container>
        );
    }
}

export default App;