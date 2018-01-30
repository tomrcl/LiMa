import React, { Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { Modal, Header, Grid, Button, Container, Form } from 'semantic-ui-react';
import * as CommonFields from './commonFields';

class MenuConsultationsModalEntretienPrenatal extends Component {


    render() {
        const { isModalOpen, modalClose, handleSubmit, pristine, submitting, loading } = this.props;

        return (
            <Container>
                <Modal
                    open={isModalOpen}
                >
                    <Header icon='browser' content='Autre'/>

                    <Modal.Content scrolling>
                        <Form onSubmit={handleSubmit} loading={loading}>
                            <Grid>
                                <Grid.Column>
                                        <Field name="entretienPrenatal.date" component={CommonFields.renderFieldDate}
                                               label="Date" dateOfDay={true} />
                                        <Field name="entretienPrenatal.description" type="textarea" component={CommonFields.renderFieldTextarea}
                                               label="Description" style={{ minHeight: 200 }}  />
                                </Grid.Column>
                            </Grid>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button primary onClick={handleSubmit} disabled={pristine || submitting}>Enregistrer</Button>
                        <Button color='red' onClick={modalClose} inverted>Annuler</Button>
                    </Modal.Actions>
                </Modal>
            </Container>
        )
    }
}

export default reduxForm({form:'modal'})(MenuConsultationsModalEntretienPrenatal);