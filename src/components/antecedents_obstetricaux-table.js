import React, {Component} from 'react';
import {Button, Header, Icon, Table, Modal, Grid, Form, Label, Container } from 'semantic-ui-react';
import {Field, reduxForm} from 'redux-form';
import * as CommonFields from './commonFields';

const validate = (values) => {
    const errors = {name:{}};
    if(!values.date) {
        errors.date = {
            message: 'Date obligatoire'
        }
    }

    return errors;
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

    modalClose = () => this.setState({ modalOpen: false })

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
            <Container fluid>
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
                        {antecedents.sort( (obs1, obs2) => (obs1.date > obs2.date ? -1 : 1) ).map( (obs, idx) => (
                            <Table.Row key={idx}>
                                <Table.Cell>
                                    {CommonFields.displayDate(obs.date)}
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
                        <Form onSubmit={this.onSubmit} loading={loading}>
                            <Grid columns='equal'>
                                <Grid.Column>
                                    <Field name="date" type="text" component={CommonFields.renderFieldDate}
                                           label="Date"/>
                                    <Field name="terme" type="text" component={CommonFields.renderFieldInput}
                                           placeholder="Terme" label={{basic: true, content: 'SA'}} labelPosition='right'/>
                                    <Field name="grossesse" type="text" component={CommonFields.renderFieldInput}
                                           placeholder="Grossesse"/>
                                    <Field name="nouveauNe" type="text" component={CommonFields.renderFieldInput}
                                           placeholder="Nouveau né"/>
                                    <Field name='allaitement' label='Allaitement' labels={['maternel', 'artificiel']} component={CommonFields.renderFieldRadioHorizontal} />
                                </Grid.Column>
                                <Grid.Column>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Label>Mode d'accouchement</Label>
                                                <Grid columns='equal'>
                                                    <Grid.Column>
                                                        <Field name="modeAccouchement.avb" label="AVB" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.instrumentale" label="Instrumentale" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.cesaProgrammee" label="Césa programmée" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.cesaUrgence" label="Césa en urgence" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.travailSpontane" label="W spontané" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.declenchement" label="Déclenchement" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.apd" label="APD" component={CommonFields.renderFieldCheckbox} />
                                                    </Grid.Column>
                                                    <Grid.Column>
                                                        <Field name="modeAccouchement.ag" label="AG" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.al" label="AL" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.sansAnesthesie" label="Sans anesthése" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.dnc" label="DNC" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.ddc" label="DDC" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.daru" label="DARU" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="modeAccouchement.hdd" label="HDD" component={CommonFields.renderFieldCheckbox} />
                                                    </Grid.Column>
                                                </Grid>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Label>Périnée</Label>
                                                <Grid columns='equal'>
                                                    <Grid.Column>
                                                        <Field name="perinee.intacte" label="Intacte" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="perinee.dechirure" label="Déchirure" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="perinee.episio" label="Episio" component={CommonFields.renderFieldCheckbox} />
                                                    </Grid.Column>
                                                    <Grid.Column>
                                                        <Field name="perinee.rpManuelle" label="RP manuelle" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="perinee.bfb" label="BFB" component={CommonFields.renderFieldCheckbox} />
                                                        <Field name="perinee.rpSonde" label="RP sonde" component={CommonFields.renderFieldCheckbox} />
                                                    </Grid.Column>
                                                </Grid>
                                            </Grid.Column>

                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                            </Grid>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary onClick={this.onSubmit} disabled={pristine || submitting}>Enregistrer</Button>
                        <Button color='red' onClick={this.modalClose} inverted>Annuler</Button>
                    </Modal.Actions>
                </Modal>

            </Container>
        )
    }
}

export default reduxForm({form: 'antecedentsObs', validate})(AntecedentsObsTable);