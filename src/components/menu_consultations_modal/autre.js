import React, { Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { Modal, Header, Grid, Button, Container, Form } from 'semantic-ui-react';
import * as CommonFields from '../commonFields';


class MenuConsultationsModalAutre extends Component {

    onSubmit = () => {
        setTimeout(this.props.handleSubmit, 200);
        this.setState({ isModalOpen: false });
    }

    componentWillReceiveProps = (nextProps) => {
        const {consult} = nextProps;
        if (consult !== this.props.consult) {
            this.props.initialize(consult);
        }
    }

    render() {
        const { isModalOpen, modalClose, pristine, submitting, loading, deleteConsult } = this.props;

        return (
            <Container>
                <Modal
                    open={isModalOpen}
                    size='fullscreen'
                >
                    <Header icon='browser' content={this.props.consult.libelle ? this.props.consult.libelle : 'Autre'}/>

                    <Modal.Content scrolling>
                        <Form onSubmit={this.onSubmit} loading={loading}>
                            <Grid columns='equal'>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Field name="libelle" type="text" component={CommonFields.renderFieldInput}
                                               placeholder="Libellé"  />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Field name="date" component={CommonFields.renderFieldDate}
                                               label="Date" dateOfDay={true} />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Field name="description" type="textarea" component={CommonFields.renderFieldTextarea}
                                               label="Description" style={{ minHeight: 200 }}  />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        {this.props.consult._id &&
                        <Button secondary onClick={() => deleteConsult(this.props.consult)}>Supprimer</Button>
                        }
                        <Button primary onClick={this.onSubmit} disabled={pristine || submitting}>Enregistrer</Button>
                        <Button color='red' onClick={modalClose} inverted>Annuler</Button>
                    </Modal.Actions>
                </Modal>
            </Container>
        )
    }
}

export default reduxForm({form:'modal'})(MenuConsultationsModalAutre);