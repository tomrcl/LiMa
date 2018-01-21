import React, { Component} from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Container, Image, Divider } from 'semantic-ui-react';

import PatienteSearchForm from '../components/patiente-search-form';

class MainPage extends Component {


    render() {
        return (
            <div>
            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item header>
                        <Image
                            size='mini'
                            src='/images/logo_boa_transparent.png'
                            style={{ marginRight: '1.5em' }}
                        />
                        LiMa
                    </Menu.Item>
                    <Menu.Item as={NavLink} exact to='/'>Liste des patientes</Menu.Item>
                    <Menu.Item as={NavLink} to='/patientes/search'>Recherche</Menu.Item>
                    <Menu.Item as={NavLink} to='/patientes/new'>Créer une patiente</Menu.Item>


                </Container>
            </Menu>

                <div style={{ marginTop: '5em' }}></div>
            </div>
        )
    }
}


export default MainPage;