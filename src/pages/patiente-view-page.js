import React, { Component} from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchPatiente } from '../actions/patiente-actions';
import { Icon, Segment, Label, List, Grid, Divider, Transition, Table, Header } from 'semantic-ui-react';
import AntecedentsObsTable from '../components/antecedents_obstetricaux-table';

class PatienteViewPage extends Component {

    state = {
        showInformations: false,
    }

    showInformationsHandle = () => {
        this.setState({showInformations:!this.state.showInformations});
    }

    componentDidMount() {
        const { _id } = this.props.match.params;
        if(_id){
            this.props.fetchPatiente(_id)
        }
    }

    getData(parent, key) {
        if (this.props.patiente[parent]) {
            return this.props.patiente[parent][key];
        } else {
            return '';
        }
    }

    render() {
        const { showInformations } = this.state;

        return (
            <div>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                            {this.props.patiente.nomJf} {this.props.patiente.nom} {this.props.patiente.prenom}
                        </Grid.Column>

                        <Grid.Column>
                            <Label as='a' onClick={this.showInformationsHandle}>
                                <Icon name='info' />
                                <Label.Detail>Informations patiente</Label.Detail>
                            </Label>
                        </Grid.Column>

                        <Grid.Column>
                            <Label as={NavLink} to={`/patientes/edit/${this.props.patiente._id}`}>
                            <Icon name='edit'/>
                                Modifier
                            </Label>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Transition visible={showInformations} animation='fade down' duration={500}>
                                <Segment padded>
                                    <Label attached='top'>Informations patiente</Label>
                                    <Grid columns='equal'>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Segment padded>
                                                    <Label attached='top left'>Administratif</Label>
                                                    <List>
                                                        <List.Item>{this.props.patiente.nomJf} {this.props.patiente.nom} {this.props.patiente.prenom}</List.Item>
                                                        <List.Item>{this.props.patiente.dateNaissance}</List.Item>
                                                        <List.Item>{this.props.patiente.email}</List.Item>
                                                    </List>
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column>

                                                <Segment padded>
                                                    <Label attached='top left'>Infos</Label>
                                                    <List>
                                                        <List.Item>Médecin: {this.getData('medecinTraitant', 'nom')}</List.Item>
                                                        <List.Item>SF/Gynéco: {this.getData('sfGyneco', 'nom')}</List.Item>
                                                        <List.Item>Allergies: {this.getData('allergies', 'ouinon')}</List.Item>
                                                    </List>
                                                </Segment>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                            </Transition>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Divider horizontal>Antécédents obstétricaux</Divider>

                <AntecedentsObsTable patiente={this.props.patiente}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        patiente: state.patienteStore.patiente,
    }
}

export default connect(mapStateToProps, {fetchPatiente})(PatienteViewPage);