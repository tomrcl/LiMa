import React, { Component} from 'react';
import { connect } from 'react-redux';
import { List,Dropdown, Container, Icon, Button, Label } from 'semantic-ui-react';
import _ from 'lodash';
import { updatePatiente } from '../actions/patiente-actions';
import * as CommonFields from '../components/commonFields';
import MenuConsultationsModalEntretienPrenatal from './menu_consultations_modal/entretien_prenatal';
import MenuConsultationsModalReeductPerinee from './menu_consultations_modal/reeduct_perinee';
import MenuConsultationsModalAutre from './menu_consultations_modal/autre';

const consultTypeLibelle = {
    'entretienPrenatal':'Entretien prénatal',
    'reeducPerinee':'CMP',
    'dossierGrossesse':'Dossier de grossesse',
    'visitePostNatale':'Visite post-natale',
    'suiviPostNatal':'Suivi post-natal',
    'autre':'Autre'
}

class MenuConsultationsListe extends Component {

    state = {
        consultations: [],
        modalToDisplay: '',
        consult: {}
    }

    consultationsType = [
        {
            text: 'Entretien prénatal',
            value: 'Entretien prénatal',
            label: { color: 'red', empty: true, circular: true },
            onClick: () => this.newConsultation('entretienPrenatal')
        },
        {
            text: 'Réeducation du perinée',
            value: 'Réeducation du perinée',
            label: { color: 'blue', empty: true, circular: true },
            onClick: () => this.newConsultation('reeducPerinee')
        },
        {
            text: 'Dossier de grossesse',
            value: 'Dossier de grossesse',
            label: { color: 'yellow', empty: true, circular: true },
            onClick: () => this.newConsultation('dossierGrossesse')
        },
        {
            text: 'Visite post-natale',
            value: 'Visite post-natale',
            label: { color: 'grey', empty: true, circular: true },
            onClick: () => this.newConsultation('visitePostNatale')
        },
        {
            text: 'Suivi post-natal',
            value: 'Suivi post-natal',
            label: { color: 'orange', empty: true, circular: true },
            onClick: () => this.newConsultation('suiviPostNatal')
        },
        {
            text: 'Autre',
            value: 'Autre',
            label: { color: 'green', empty: true, circular: true },
            onClick: () => this.newConsultation('autre')
        }
    ]

    newConsultation = (consultType) => {
        const consult = {consultType: consultType}
        this.setState({modalToDisplay: consultType, consult: consult});
    }

    modalClose = () => {
        this.setState({
            modalToDisplay: ''
        })
        this.setState({consultations: renderConsultations(this.props.patiente.consultations)});
    }

    saveConsultation = (consultation) => {
        const consultType = consultation.consultType;

        if (!consultation.date) {
            consultation.date = new Date();
        }

        // edit : remove the existing entry
        if (consultation._id) {
            const otherConsults = this.props.patiente.consultations[consultType].filter(c => c._id !== consultation._id);
            this.props.patiente.consultations[consultType] = otherConsults;
        }

        // initialise le type de consultation si elle n'existe pas encore
        if (!this.props.patiente.consultations[consultType]) {
            this.props.patiente.consultations[consultType] = [];
        }

        this.props.patiente.consultations[consultType].push(consultation);

        this.props.updatePatiente(this.props.patiente)
            .then(response => {
                this.setState({
                    consultations: renderConsultations(this.props.patiente.consultations)});
            })
            .catch(err => console.error(err));
        this.modalClose();
    }

    editConsultation = (consultation) => {
        this.setState({consult: consultation, modalToDisplay: consultation.consultType});
    }

    deleteConsultation = (consultation) => {
        const consultType = consultation.consultType;
        const otherConsults = this.props.patiente.consultations[consultType].filter( c => c._id !== consultation._id);
        this.props.patiente.consultations[consultType] = otherConsults;

        this.props.updatePatiente(this.props.patiente)
            .then(response => {
                this.setState({
                    consultations: renderConsultations(this.props.patiente.consultations)});
            })
            .catch(err => console.error(err));
        this.modalClose();
    }

    renderLibelle = (consult) => {
        if (consult.consultType === 'autre') {
            return (consult.libelle ? consult.libelle : consult.consultTypeLibelle)
        } else if (consult.consultType === 'reeducPerinee') {
            return 'CMP' + (consult.numero ? ' n° ' + consult.numero : '')
        } else {
            return consult.consultTypeLibelle;
        }

    }

    render() {
        const { patiente } = this.props;
        const { modalToDisplay, consult } = this.state;

        return (
            <Container fluid>
                <List verticalAlign='middle'>
                    <List.Item>
                        <List.Content floated='right'>
                            <Dropdown icon='plus' floating button className='icon' compact basic>
                                <Dropdown.Menu>
                                    {this.consultationsType.map(csType => <Dropdown.Item key={csType.value} {...csType}/>)}
                                </Dropdown.Menu>
                            </Dropdown>
                        </List.Content>
                        <List.Content>
                            <h4>Consultations</h4>
                        </List.Content>
                    </List.Item>

                {renderConsultations(patiente.consultations).sort( (cs1, cs2) => cs1.date > cs2.date ? -1 : 1 ).map( (consult, idx) => (
                    <List.Item key={idx} as='a' style={{padding:'0.1em'}}>
                        <List.Content floated='right'>
                            <Button icon basic size='mini' onClick={() => this.editConsultation(consult)}>
                                <Icon name='edit'/>
                            </Button>
                        </List.Content>
                        <List.Content>
                            <Label onClick={() => this.editConsultation(consult)} style={{paddingLeft:'0.3em', paddingRight:'0.3em'}}>
                            {CommonFields.displayDate(consult.date)} {this.renderLibelle(consult)}
                            </Label>
                        </List.Content>
                    </List.Item>
                ))}
                </List>

                <MenuConsultationsModalEntretienPrenatal isModalOpen={modalToDisplay==='entretienPrenatal'} consult={consult} modalClose={this.modalClose} onSubmit={this.saveConsultation}/>
                <MenuConsultationsModalReeductPerinee isModalOpen={modalToDisplay==='reeducPerinee'} consult={consult} modalClose={this.modalClose} onSubmit={this.saveConsultation}/>
                <MenuConsultationsModalAutre isModalOpen={modalToDisplay==='autre'} consult={consult} modalClose={this.modalClose} onSubmit={this.saveConsultation} deleteConsult={this.deleteConsultation}/>
            </Container>
        )
    }
}

function renderConsultations(consultations) {
    let cs = [];
    _.map(consultations, (val, key) => {
        val.map( v => {
            v['consultType'] = key;
            v['consultTypeLibelle'] = consultTypeLibelle[key];
            cs.push(v)
        })
    })
    return cs;
}

function mapStateToProps(state) {
    return {
        patiente: state.patienteStore.patiente,
    }
}

export default connect(mapStateToProps, {updatePatiente})(MenuConsultationsListe);

