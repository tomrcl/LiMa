import React, { Component } from 'react';
import {
    Prompt
} from 'react-router-dom'
import { Form, Button, Checkbox, Transition, Segment, Image, List, Grid, Radio } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import classnames from 'classnames';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import 'react-widgets/dist/css/react-widgets.css';

Moment.locale('fr');
momentLocalizer();

const validate = (values) => {
    const errors = {name:{}};
    if(!values.nomJf) {
        errors.nomJf = {
            message: 'Nom de JF obligatoire'
        }
    }
    if(values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = {
            message: 'Invalid email address'
        }
    }
    return errors;
}

const dateFormats = [
    'DD/MM/YYYY',
    'DD/MM/YY',
    'DDMMYY',
    'DDMMYYYY'
];

class PatienteForm extends Component {

    state = {
        showPartenaireForm: false,
    }

    statutRadioHandle = ( value ) => {
        this.setState({ showPartenaireForm: value[0] === 'E' });
    }

    componentWillReceiveProps = (nextProps) => { // Receive Contact data Asynchronously
        const {patiente} = nextProps;
        if (patiente._id !== this.props.patiente._id) { // Initialize form only once
            this.props.initialize(patiente);
            this.setState({ showPartenaireForm: patiente.statut === 'En couple' });
        }
    }

    renderField = ({input, label, type, meta: {touched, error}}) => (
        <Form.Field className={classnames({error: touched && error})}>
            <label>{label}</label>
            <input {...input} placeholder={label} type={type} id={input.name} />
            {touched && error && <span className="error">{error.message}</span>}
        </Form.Field>
    )

    renderFieldTextarea = ({input, label, type, meta: {touched, error}}) => (
        <Form.Field className={classnames({error: touched && error})}>
            <label>{label}</label>
            <textarea {...input} placeholder={label} type={type}/>
            {touched && error && <span className="error">{error.message}</span>}
        </Form.Field>
    )

    renderFieldTextareaNoLabel = ({input, label, type, meta: {touched, error}}) => (
        <Form.Field className={classnames({error: touched && error})}>
            <textarea {...input} placeholder={label} type={type}/>
            {touched && error && <span className="error">{error.message}</span>}
        </Form.Field>
    )

    renderFieldDate = ({input, name, label, meta: {touched, error}}) => (
        <Form.Field className={classnames({error: touched && error})}>
            <label>{label}</label>
            <DateTimePicker
                value={input.value ? new Date(input.value) : null}
                name={name}
                format='DD/MM/YYYY'
                time={false}
                parse={dateFormats}
                placeholder={label}
                onChange={(value) => input.onChange(value)}
                />
            {touched && error && <span className="error">{error.message}</span>}
        </Form.Field>
    )

    renderFieldCheckbox = ({ input, label }) => (
        <Form.Field>
            <Checkbox
                label={label}
                checked={input.value ? true : false}
                onChange={(e, { checked }) => input.onChange(checked)}
            />
        </Form.Field>
    )

    renderFieldRadio = ({ input, label, labels, name }) => (
        <Form.Field>
            <label>{label}</label>
                {labels.map( (label) => (
                    <Radio
                        key={name + '_' + label }
                        name={name}
                        label={label}
                        value={label}
                        checked={input.value === label}
                        onChange={() => input.onChange(label)}
                    />
                ))}
        </Form.Field>
    )

    render() {
        const {handleSubmit, pristine, submitting, loading} = this.props;
        const {showPartenaireForm} = this.state;

        return (
            <div>
                <Prompt
                    when={!pristine}
                    message='Etes-vous sur de vouloir quitter le formulaire ?'
                />

                <h1 style={{marginTop: "1em"}}>{this.props.patiente._id ? 'Modifier patiente' : 'Nouvelle patiente'}</h1>


                <Form onSubmit={handleSubmit} loading={loading}>

                    <Grid columns='equal'>
                        <Grid.Row>
                            <Grid.Column>
                                <Field name="nomJf" type="text" component={this.renderField} label="Nom de jeune fille"/>
                                <Field name="nom" type="text" component={this.renderField} label="Nom d'épouse"/>
                                <Field name="prenom" type="text" component={this.renderField} label="Prénom"/>
                                <Field name="dateNaissance" type="text" component={this.renderFieldDate} label="Date de naissance"/>
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="telephone" type="text" component={this.renderField} label="Téléphone"/>
                                <Field name="email" type="text" component={this.renderField} label="Email"/>
                            </Grid.Column>
                        </Grid.Row>


                        <Grid.Row>
                            <Grid.Column>
                                <Field name="adresse" type="textarea" component={this.renderFieldTextarea} label="Adresse"/>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="activite" type="text" component={this.renderField} label="Activité"/>
                                <Field name='activite' label='Activité' labels={['Sans profession', 'Mère au foyer', 'Recherche d\'emploi']} component={this.renderFieldRadio} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='statut' label='Statut' labels={['Célibataire', 'En couple', 'Divorcée', 'Veuve']} component={this.renderFieldRadio} onChange={
                                    this.statutRadioHandle
                                } />
                                <Transition visible={showPartenaireForm} animation='scale' duration={500}>
                                    <Segment>
                                        <label>Partenaire</label>
                                        <Grid columns='equal'>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Field name="partenaire.nom" type="text" component={this.renderField} label="Nom"/>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Field name="partenaire.prenom" type="text" component={this.renderField} label="Prénom"/>
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Field name="partenaire.dateNaissance" type="text" component={this.renderFieldDate} label="Date de naissance"/>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Field name="partenaire.activite" type="text" component={this.renderField} label="Activité"/>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Segment>
                                </Transition>

                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="medecinTraitant.nom" type="text" component={this.renderField} label="Médecin traitant"/>
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="medecinTraitant.ville" type="text" component={this.renderField} label="Ville"/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Field name="sfGyneco.nom" type="text" component={this.renderField} label="Sage femme / Gynécologue"/>
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="sfGyneco.ville" type="text" component={this.renderField} label="Ville"/>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="specialistes" type="textarea" component={this.renderFieldTextarea} label="Autres spécialistes"/>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='allergies' label='Allergies' labels={['oui', 'non']} component={this.renderFieldRadio} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='groupeSanguin.groupe' label='Groupe sanguin' labels={['O', 'A', 'B', 'AB']} component={this.renderFieldRadio} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name='groupeSanguin.rhesus' label='Rhésus' labels={['+', '-']} component={this.renderFieldRadio} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name='groupeSanguin.carteAjour' label='Carte à jour' labels={['oui', 'non']} component={this.renderFieldRadio} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <label>Antécédents familiaux</label>
                                    <Field name='antecedents.familiaux.aucun' label='Aucun' component={this.renderFieldCheckbox} />
                                    <Field name='antecedents.familiaux.diabete' label='Diabète' component={this.renderFieldCheckbox} />
                                    <Field name='antecedents.familiaux.obesite' label='Obésité' component={this.renderFieldCheckbox} />
                                    <Field name='antecedents.familiaux.hta' label='HTA' component={this.renderFieldCheckbox} />
                                    <Field name='antecedents.familiaux.cardiovasculaires' label='Cardiovasculaires' component={this.renderFieldCheckbox} />
                                    <Field name='antecedents.familiaux.cancershormonodependants' label='Cancers hormonodépendants' component={this.renderFieldCheckbox} />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <label>Antécédents médicaux</label>
                                    <Field name='antecedents.medicaux.aucun' label='Aucun' component={this.renderFieldCheckbox} />
                                    <Field name='antecedents.medicaux.asthme' label='Asthme' component={this.renderFieldCheckbox} />
                                    <Field name='antecedents.medicaux.migraines' label='Migraines' component={this.renderFieldCheckbox} />
                                    <Field name="antecedents.medicaux.autres" type="text" component={this.renderFieldTextareaNoLabel} label="Autres" displayLabel={false} />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <label>Antécédents chirurgicaux</label>
                                    <Field name='antecedents.chirurgicaux.aucun' label='Aucun' component={this.renderFieldCheckbox} />
                                    <Field name='antecedents.chirurgicaux.appendicectomie' label='Appendicectomie' component={this.renderFieldCheckbox} />
                                    <Field name='antecedents.chirurgicaux.dds' label='DDS' component={this.renderFieldCheckbox} />
                                    <Field name="antecedents.chirurgicaux.autres" type="text" component={this.renderFieldTextareaNoLabel} label="Autres" />
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Button primary onClick={() => handleSubmit} disabled={pristine || submitting}>Enregistrer</Button>
                </Form>


            </div>
        )
    }
}

export default reduxForm({form: 'patiente', validate})(PatienteForm);