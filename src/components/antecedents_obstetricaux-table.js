import React, {Component} from 'react';
import {Button, Header, Icon, Table, Modal, Grid, Form, Label } from 'semantic-ui-react';
import {Field, reduxForm} from 'redux-form';
import * as CommonFields from './commonFields';

import Moment from 'moment'
Moment.locale('fr')


const dataTest =
    {
        _id: "1",
        nomJf: "nomJf test",
        nom: "nom test",
        prenom: "prenom test",
        telephone: "060606",
        email: "test@truc.com",
        adresse: "1 rue du test",
        antecedents: {
            obstetricaux: [
                {
                    date: '2018/01/01',
                    terme: '32 sem',
                    grossesse: 'oui',
                    lieu: 'Niort',
                    modeAccouchement: 'naturel',
                    nouveauNe: 'Jean',
                    allaitement: 'maternel'
                },
                {
                    date: '2017/01/01',
                    terme: '30 sem',
                    grossesse: 'oui',
                    lieu: 'Toulouse',
                    modeAccouchement: 'synthese',
                    nouveauNe: 'Ginette',
                    allaitement: 'maternel'
                }
            ]
        }
    }
;

const validate = (values) => {
    const errors = {name:{}};
    if(!values.date) {
        errors.date = {
            message: 'Date obligatoire'
        }
    }

    return errors;
}

const empty = {
    allaitement
        :
        "def",
    date
        :
        "",
    grossesse
        :
        "def",
    modeAccouchement
        :
        "def",
    nouveauNe
        :
        "def",
    terme
        :
        "def",

}

class AntecedentsObsTable extends Component {

    state = {
        modalOpen: false,
        antecedents: []
    }

    onSubmit = () => {
        setTimeout(this.props.handleSubmit, 200);
        this.setState({ modalOpen: false });
    }

    modalOpenClose = () => this.setState({ modalOpen: !this.state.modalOpen })

    componentWillReceiveProps = (nextProps) => {
        const {antecedents} = nextProps;
        this.setState({antecedents: antecedents});
    }

    newAntecedentObs = () => {
        this.props.initialize({});
        this.setState({ modalOpen: true });
    }

    editAntecedentObs = (antecedentObs) => {
        this.props.initialize(antecedentObs);
        this.setState({ modalOpen: true });
    }

    render() {
        const { pristine, submitting, loading, deleteAntecedentObs} = this.props;
        const { antecedents, modalOpen } = this.state;

        return (
            <div>
                <Table basic='very' celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Terme</Table.HeaderCell>
                            <Table.HeaderCell>Grossesse</Table.HeaderCell>
                            <Table.HeaderCell>Mode accouchement</Table.HeaderCell>
                            <Table.HeaderCell>Nouveau né</Table.HeaderCell>
                            <Table.HeaderCell>Allaitement</Table.HeaderCell>
                            <Table.HeaderCell>Périnée</Table.HeaderCell>
                            <Table.HeaderCell textAlign='center'>
                                <Button icon basic size='mini' onClick={this.newAntecedentObs}>
                                    <Icon name='plus'/>
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {antecedents.map( (obs, idx) => (
                            <Table.Row key={idx}>
                                <Table.Cell>
                                    {displayDate(obs.date)}
                                </Table.Cell>
                                <Table.Cell>
                                    {obs.terme}
                                </Table.Cell>
                                <Table.Cell>
                                    {obs.grossesse}
                                </Table.Cell>
                                <Table.Cell>
                                    {obs.modeAccouchement}
                                </Table.Cell>
                                <Table.Cell>
                                    {obs.nouveauNe}
                                </Table.Cell>
                                <Table.Cell>
                                    {obs.allaitement}
                                </Table.Cell>
                                <Table.Cell>
                                    {obs.perinee}
                                </Table.Cell>
                                <Table.Cell textAlign='center'>
                                    <Button icon basic size='mini' onClick={() => this.editAntecedentObs(obs)}>
                                        <Icon name='edit'/>
                                    </Button>
                                    <Button icon basic size='mini' onClick={() => deleteAntecedentObs(idx)}>
                                        <Icon name='delete'/>
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                <Modal
                    open={modalOpen}
                    onClose={this.handleClose}
                >
                    <Header icon='browser' content='Antécédent obstétrique'/>

                    <Modal.Content scrolling>
                        <div>
                            <Form onSubmit={this.onSubmit} loading={loading}>
                                <Grid columns='equal'>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Field name="date" type="text" component={CommonFields.renderFieldDate}
                                                   label="Date"/>
                                            <Field name="terme" type="text" component={CommonFields.renderFieldInput}
                                                   placeholder="Terme"/>
                                            <Field name="grossesse" type="text" component={CommonFields.renderFieldInput}
                                                   placeholder="Grossesse"/>
                                            <Field name="nouveauNe" type="text" component={CommonFields.renderFieldInput}
                                                   placeholder="Nouveau né"/>
                                            <Field name="allaitement" type="text" component={CommonFields.renderFieldInput}
                                                   placeholder="Allaitement"/>
                                            <Field name="perinee" type="text" component={CommonFields.renderFieldInput}
                                                   placeholder="Périnée"/>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                        <Label>Mode d'accouchement</Label>
                                                        <Field name="modeAccouchement.avb" label="AVB" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.instrumentale" label="Instrumentale" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.cesaProgrammee" label="Césa programmée" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.cesaUrgence" label="Césa en urgence" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.travailSpontane" label="W spontané" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.declenchement" label="Déclenchement" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.apd" label="APD" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.ag" label="AG" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.al" label="AL" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.sansAnesthesie" label="Sans anesthése" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.dnc" label="DNC" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.ddc" label="DDC" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.daru" label="DARU" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.hdd" label="HDD" component={CommonFields.renderFieldCheckbox} />
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Grid.Column>
                                                        <Label>Périnée</Label>
                                                        <Field name="perinee.intacte" label="Intacte" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="perinee.dechirure" label="Déchirure" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="perinee.episio" label="Episio" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="perinee.rpManuelle" label="RP manuelle" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="perinee.bfb" label="BFB" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="perinee.rpSonde" label="RP sonde" component={CommonFields.renderFieldCheckbox} />
                                                    </Grid.Column>

                                                </Grid.Row>
                                            </Grid>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form>
                        </div>
                    </Modal.Content>
                <Modal.Actions>
                    <Button primary onClick={this.onSubmit} disabled={pristine || submitting}>Enregistrer</Button>
                    <Button color='red' onClick={this.modalOpenClose} inverted>Annuler</Button>
                </Modal.Actions>
                </Modal>

            </div>
        )
    }
}

function displayDate(date) {
    const formattedDT = Moment(date).format('DD/MM/YYYY');
    return formattedDT;
}

AntecedentsObsTable = reduxForm({form: 'antecedentsObs', validate})(AntecedentsObsTable)

// AntecedentsObsTable = connect(
//     { load: loadAccount } // bind account loading action creator
// )(AntecedentsObsTable)

export default AntecedentsObsTable;