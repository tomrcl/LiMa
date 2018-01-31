import React, { Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import { Modal, Header, Grid, Button, Container, Form } from 'semantic-ui-react';
import * as CommonFields from '../commonFields';


class MenuConsultationsModalReeductPerinee extends Component {

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
        const { isModalOpen, modalClose, pristine, submitting, loading } = this.props;

        return (
            <Container>
                <Modal
                    open={isModalOpen}
                >
                    <Header icon='browser' content={'CMP' + (this.props.consult.numero ? ' n° ' + this.props.consult.numero : '')}/>

                    <Modal.Content scrolling>
                        <Form onSubmit={this.onSubmit} loading={loading}>
                            <Grid columns='equal'>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Field name="numero" type="text" component={CommonFields.renderFieldInput}
                                               placeholder="N°"  />
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
                        <Button primary onClick={this.onSubmit} disabled={pristine || submitting}>Enregistrer</Button>
                        <Button color='red' onClick={modalClose} inverted>Annuler</Button>
                    </Modal.Actions>
                </Modal>
            </Container>
        )
    }
}

export default reduxForm({form:'modal'})(MenuConsultationsModalReeductPerinee);