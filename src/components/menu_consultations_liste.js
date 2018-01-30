import React, { Component} from 'react';
import { connect } from 'react-redux';
import { List,Dropdown, Container } from 'semantic-ui-react';
import _ from 'lodash';
import { updatePatiente } from '../actions/patiente-actions';
import * as CommonFields from '../components/commonFields';
import MenuConsultationsModalEntretienPrenatal from './menu_consultations_modal_entretien_prenatal';
import MenuConsultationsModalAutre from './menu_consultations_modal_autre';

const consultTypeLibelle = {
    'entretienPrenatal':'Entretien prénatal',
    'reeducPerinee':'Réeducation du perinée',
    'dossierGrossess':'Dossier de grossesse',
    'visitePostNatale':'Visite post-natale',
    'suiviPostNatal':'Suivi post-natal',
    'autre':'Autre'
}

class MenuConsultationsListe extends Component {

    state = {
        consultations: [],
        modalEntretienPrenatal: false,
        modalAutre: false,
        consult: {}
    }

    consultationsType = [
        {
            text: 'Entretien prénatal',
            value: 'Entretien prénatal',
            label: { color: 'red', empty: true, circular: true },
            onClick: () => this.newEntretienPrenatal()
        },
        {
            text: 'Réeducation du perinée',
            value: 'Réeducation du perinée',
            label: { color: 'blue', empty: true, circular: true },
            onClick: () => this.newReeducPerinee()
        },
        {
            text: 'Dossier de grossesse',
            value: 'Dossier de grossesse',
            label: { color: 'yellow', empty: true, circular: true },
            onClick: () => this.newDossierGrossesse()
        },
        {
            text: 'Visite post-natale',
            value: 'Visite post-natale',
            label: { color: 'grey', empty: true, circular: true },
            onClick: () => this.newVisitePostNatale()
        },
        {
            text: 'Suivi post-natal',
            value: 'Suivi post-natal',
            label: { color: 'orange', empty: true, circular: true },
            onClick: () => this.newSuiviPostNatal()
        },
        {
            text: 'Autre',
            value: 'Autre',
            label: { color: 'green', empty: true, circular: true },
            onClick: () => this.newAutre()
        }
    ]

    newEntretienPrenatal = () => {
        console.log('newEntretienPrenatal');
        this.setState({modalEntretienPrenatal:true});
    }

    newReeducPerinee = () => {
        console.log('newReeducPerinee');
    }

    newDossierGrossesse = () => {
        console.log('newDossierGrossesse');
    }

    newVisitePostNatale = () => {
        console.log('newVisitePostNatale');
    }

    newSuiviPostNatal = () => {
        console.log('newSuiviPostNatal');
    }

    newAutre = () => {
        const consult = {consultType:'autre'}
        this.setState({modalAutre:true, consult: consult});
    }

    editautre = (consult) => {
        this.setState({modalAutre:true, consult: consult});
    }

    modalClose = () => {
        this.setState({
            modalEntretienPrenatal: false,
            modalAutre: false
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

        this.props.patiente.consultations[consultType].push(consultation);

        this.props.updatePatiente(this.props.patiente)
            .then(response => {
                this.setState({
                    consultations: renderConsultations(this.props.patiente.consultations),
                    consultationsCount: this.props.patiente.consultations.length});
            })
            .catch(err => console.error(err));
        this.modalClose();
    }

    render() {
        const { patiente } = this.props;
        const {  modalEntretienPrenatal, modalAutre, consult } = this.state;


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
                    <List.Item key={idx} as='a' onClick={() => this.editautre(consult)}>
                        {CommonFields.displayDate(consult.date)} - {consult.consultTypeLibelle}
                    </List.Item>
                ))}
                </List>

                <MenuConsultationsModalEntretienPrenatal isModalOpen={modalEntretienPrenatal} consult={consult} modalClose={this.modalClose} onSubmit={this.saveConsultation}/>
                <MenuConsultationsModalAutre isModalOpen={modalAutre} consult={consult} modalClose={this.modalClose} onSubmit={this.saveConsultation}/>
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

