import React, { Component} from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchPatiente, updatePatiente } from '../actions/patiente-actions';
import { Icon, Segment, Label, List, Grid, Divider, Transition } from 'semantic-ui-react';
import AntecedentsObsTable from '../components/antecedents_obstetricaux-table';
import * as CommonFields from '../components/commonFields';


class PatienteViewPage extends Component {

    state = {
        showInformations: false,
        antecedentsObs: [],
        antecedentsObsCount: 0
    }

    showInformationsHandle = () => {
        this.setState({showInformations:!this.state.showInformations});
    }

    componentDidMount() {
        const { _id } = this.props.match.params;
        if(_id){
            this.props.fetchPatiente(_id)
                .then(response =>
                    this.setState({
                        antecedentsObs: this.getData('antecedents', 'obstetricaux'),
                        antecedentsObsCount: this.getData('antecedents', 'obstetricaux').length
                    }));
        }
    }

    getData(parent, key) {
        if (this.props.patiente[parent]) {
            return this.props.patiente[parent][key];
        } else {
            return '';
        }
    }

    submit = (antecedentObs) => {
        console.log(antecedentObs)
        // ajoute l'antecedentObs à la patiente
        this.props.patiente.antecedents.obstetricaux.push(antecedentObs)
        this.props.updatePatiente(this.props.patiente)
            .then(response => {
                console.log(this.props.patiente.antecedents.obstetricaux);
                this.setState({
                    antecedentsObs: this.props.patiente.antecedents.obstetricaux,
                    antecedentsObsCount: this.props.patiente.antecedents.obstetricaux.length
                });
            })
            .catch(err => console.error(err));
    }

    deleteAntecedentObs = (antecedentObsIdx) => {
        this.props.patiente.antecedents.obstetricaux.splice(antecedentObsIdx, 1);
        this.props.updatePatiente(this.props.patiente)
            .then(response => {
                this.setState({
                    antecedentsObs: this.props.patiente.antecedents.obstetricaux,
                    antecedentsObsCount: this.props.patiente.antecedents.obstetricaux.length
                })
            })
            .catch(err => console.error(err));
    }

    render() {
        const { showInformations, antecedentsObs, antecedentsObsCount } = this.state;

        return (
            <div>
                <Grid columns='equal'>
                    <Grid.Row>
                        <Grid.Column>
                            <h1>{CommonFields.fullName(this.props.patiente)}</h1>
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

                <AntecedentsObsTable antecedents={antecedentsObs} counter={antecedentsObsCount} loading={this.props.loading} onSubmit={this.submit} deleteAntecedentObs={this.deleteAntecedentObs}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        patiente: state.patienteStore.patiente,
    }
}

export default connect(mapStateToProps, {fetchPatiente, updatePatiente})(PatienteViewPage);