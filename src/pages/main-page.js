import React, { Component} from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Container, Image } from 'semantic-ui-react';
import PatienteSearchForm from './patiente-search-page'

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
                        <Menu.Item header>
                            <PatienteSearchForm/>
                        </Menu.Item>
                        <Menu.Item as={NavLink} exact to='/'>Liste des patientes</Menu.Item>
                        <Menu.Item as={NavLink} exact to='/patientes/new'>Créer une patiente</Menu.Item>
                    </Container>
                </Menu>

                <div style={{ marginTop: '61px' }}></div>
            </div>
        )
    }
}


export default MainPage;