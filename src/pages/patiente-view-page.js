import React, { Component} from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { fetchPatiente, updatePatiente } from '../actions/patiente-actions';
import { Icon, Segment, Label, List, Grid, Divider, Transition } from 'semantic-ui-react';
import MenuConsultations from '../components/menu_consultations'
import AntecedentsObsTable from '../components/antecedents_obstetricaux-table';
import * as CommonFields from '../components/commonFields';

class PatienteViewPage extends Component {

    state = {
        showInformations: false,
        antecedentsObs: [],
        antecedentsObsCount: 0,
    }

    showInformationsHandle = () => {
        this.setState({showInformations:!this.state.showInformations});
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log('willreceice')
    //     const { _id } = nextProps.match.params;
    //         console.log("id=" + _id)
    //         console.log("propsidwillreceveive=" + this.props.patiente._id)
    //     if (_id && (_id !== this.props.patiente._id)) {
    //         // this.props.initialize(patiente)
    //         this.props.fetchPatiente(_id)
    //             .then(response =>
    //                 this.setState({
    //                     antecedentsObs: CommonFields.getData(this.props.patiente, 'antecedents', 'obstetricaux'),
    //                     antecedentsObsCount: CommonFields.getData(this.props.patiente, 'antecedents', 'obstetricaux').length
    //                 }));
    //     }
    // }

    componentDidMount() {
        console.log('didmount')
        const { _id } = this.props.match.params;
        if(_id){
            // console.log("propsiddidmount="+_id)
            this.props.fetchPatiente(_id)
                .then(response =>
                    this.setState({
                        antecedentsObs: CommonFields.getData(this.props.patiente, 'antecedents', 'obstetricaux'),
                        antecedentsObsCount: CommonFields.getData(this.props.patiente, 'antecedents', 'obstetricaux').length
                    }));
        }
    }

    submit = (antecedentObs) => {
        // edit : remove the existing entry
        if (antecedentObs._id) {
            const otherAntecedentsObs = this.props.patiente.antecedents.obstetricaux.filter(ao => ao._id !== antecedentObs._id);
            this.props.patiente.antecedents.obstetricaux = otherAntecedentsObs;
        }

        // ajoute l'antecedentObs à la patiente
        this.props.patiente.antecedents.obstetricaux.push(antecedentObs)
        this.props.patiente.antecedents.obstetricaux = this.props.patiente.antecedents.obstetricaux.sort( (obs1, obs2) => (obs1.date < obs2.date ? -1 : 1) );
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
            <Segment style={{ padding: '0em' }} vertical>
                <Grid celled='internally' columns='equal' stackable>
                    <Grid.Row>
                        <Grid.Column style={{maxWidth:'270px'}}>
                            <MenuConsultations/>

                        </Grid.Column>
                        <Grid.Column>

                            <Grid columns='equal'>
                                <Grid.Column width={10}>
                                    <h2>{CommonFields.fullName(this.props.patiente)}</h2>
                                </Grid.Column>

                                <Grid.Column>
                                    <Label as='a' onClick={this.showInformationsHandle}>
                                        <Icon name='info' />
                                        <Label.Detail>Informations</Label.Detail>
                                    </Label>
                                </Grid.Column>

                                <Grid.Column floated='right'>
                                    <Label as={NavLink} to={`/patientes/edit/${this.props.patiente._id}`}>
                                        <Icon name='edit'/>
                                        Modifier
                                    </Label>
                                </Grid.Column>
                            </Grid>

                            <Transition visible={showInformations === true} animation='fade down' duration={500}>
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
                                                        <List.Item>Médecin: {CommonFields.getData(this.props.patiente, 'medecinTraitant', 'nom')}</List.Item>
                                                        <List.Item>SF/Gynéco: {CommonFields.getData(this.props.patiente, 'sfGyneco', 'nom')}</List.Item>
                                                        <List.Item>Allergies: {CommonFields.getData(this.props.patiente, 'allergies', 'ouinon')}</List.Item>
                                                    </List>
                                                </Segment>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Segment>
                            </Transition>

                            <Divider horizontal>Antécédents obstétricaux</Divider>

                            <AntecedentsObsTable antecedents={antecedentsObs} counter={antecedentsObsCount} loading={this.props.loading} onSubmit={this.submit} deleteAntecedentObs={this.deleteAntecedentObs}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
}

function mapStateToProps(state) {
    return {
        patiente: state.patienteStore.patiente,
        patientes : state.patienteStore.patientes
    }
}

export default connect(mapStateToProps, {fetchPatiente, updatePatiente})(PatienteViewPage);