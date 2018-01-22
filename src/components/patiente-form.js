import React, { Component } from 'react';
import {Prompt} from 'react-router-dom'
import { Form, Button, Input, Checkbox, Transition, Segment, Grid, Radio, TextArea, Icon, Divider, Label } from 'semantic-ui-react';
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
            message: 'Nom de jeune fille obligatoire'
        }
    }
    if(values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = {
            message: 'Adresse email invalide'
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
        age: '',
        agePartenaire: '',
        showPereGroupeSanguinForm: false,
        imc: ''
    }

    fullName(patiente, age) {
        return patiente.nomJf +
            ' ' + patiente.nom +
            ' ' + patiente.prenom +
            ' (' + age + ' ans)'
    }

    statutRadioHandle = ( value ) => {
        this.setState({ showPartenaireForm: value[0] === 'E' });
    }

    rhesusRadioHandle = ( value ) => {
        this.setState({ showPereGroupeSanguinForm: value[0] === '-' });
    }

    dateNaissanceHandle = ( e, value ) => {
        this.setState({ age: calculAge(value) });
    }

    dateNaissancePartenaireHandle = ( e, value ) => {
        this.setState({ agePartenaire: calculAge(value) });
    }

    calculImc = () => {
        const taille = document.getElementsByName('taille')[0].value;
        const poids = document.getElementsByName('poids')[0].value;

        if (taille && poids) {
            // poids / taille^2
            this.setState({ imc: ((poids / (taille*taille))*10000).toFixed(2) });
        } else {
            this.setState({ imc: '' });
        }
    }

    componentWillReceiveProps = (nextProps) => { // Receive Contact data Asynchronously
        const {patiente} = nextProps;
        if (patiente._id !== this.props.patiente._id) { // Initialize form only once
            this.props.initialize(patiente);
            this.setState({
                showPartenaireForm: patiente.statut === 'En couple',
                age: calculAge(patiente.dateNaissance),
                agePartenaire: patiente.partenaire ? calculAge(patiente.partenaire.dateNaissance) : '',
                showPereGroupeSanguinForm : patiente.groupeSanguin ? patiente.groupeSanguin.rhesus === '-' : '',
                imc: patiente.poids && patiente.taille ? ((patiente.poids / (patiente.taille*patiente.taille))*10000).toFixed(2) : ''
            });
        }
    }

    renderFieldInput = ({input, placeholder, type, icon, label, labelPosition, meta: {touched, error}}) => (
        <Form.Field className={classnames({error: touched && error})}>
            {placeholder &&
            <Label>{placeholder}</Label>
            }
            <Input {...input} placeholder={placeholder} type={type} label={label} labelPosition={labelPosition}/>
            {touched && error && <span className="error">{error.message}</span>}
        </Form.Field>
    )

    renderFieldInputIcon = ({input, label, type, icon, meta: {touched, error}}) => (
        <Form.Field className={classnames({error: touched && error})}>
            <Label>{label}</Label>
            <Input {...input} placeholder={label} type={type} iconPosition='left'>
                <Icon name={icon} />
                <input/>
            </Input>
            {touched && error && <span className="error">{error.message}</span>}
        </Form.Field>
    )

    renderFieldTextarea = ({input, label, displayLabel=true, type, meta: {touched, error}}) => (
        <Form.Field className={classnames({error: touched && error})}>
            {displayLabel &&
            <Label>{label}</Label>
            }
            <TextArea {...input} placeholder={label}/>
            {touched && error && <span className="error">{error.message}</span>}
        </Form.Field>
    )

    renderFieldDate = ({input, name, label, meta: {touched, error}}) => (
        <Form.Field className={classnames({error: touched && error})}>
            <Label>{label}</Label>
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

    renderFieldCheckbox = ({ input, label, meta: {touched, error}}) => (
        <Form.Field className={classnames({error: touched && error})}>
            <Checkbox
                label={label}
                checked={input.value ? true : false}
                onChange={(e, { checked }) => input.onChange(checked)}
            />
        </Form.Field>
    )

    renderFieldRadioHorizontal = ({ input, label, labels, name, meta: {touched, error}}) => (
        <Form.Field className={classnames({error: touched && error})}>
            {label &&
            <Label>{label}</Label>
            }
            <Grid columns='equal'>
                <Grid.Row>
                {labels.map( label => (

                        <Grid.Column key={name + '_' + label }>
                            <Radio

                                name={name}
                                label={label}
                                value={label}
                                checked={input.value === label}
                                onChange={() => input.onChange(label)}
                            />
                        </Grid.Column>
                ))}
                    </Grid.Row>
            </Grid>
        </Form.Field>
    )

    renderFieldRadioVertical = ({ input, label, labels, name, meta: {touched, error}}) => (
        <Form.Field className={classnames({error: touched && error})}>
            <Label>{label}</Label>
            <Grid columns='equal'>
                    {labels.map( (label) => (
                <Grid.Row key={name + '_' + label }>

                        <Grid.Column>
                            <Radio

                                name={name}
                                label={label}
                                value={label}
                                checked={input.value === label}
                                onChange={() => input.onChange(label)}
                            />
                        </Grid.Column>
                </Grid.Row>
                    ))}
            </Grid>
        </Form.Field>
    )

    render() {
        const {handleSubmit, pristine, submitting, loading} = this.props;
        const {showPartenaireForm, age, agePartenaire, showPereGroupeSanguinForm, imc} = this.state;

        return (
            <div>
                <Prompt
                    when={!pristine}
                    message='Etes-vous sur de vouloir quitter le formulaire ?'
                />

                <h1 style={{marginTop: "1em"}}>{this.props.patiente._id ? 'Modifier fiche '+ this.fullName(this.props.patiente, age) : 'Nouvelle patiente'}</h1>


                <Form onSubmit={handleSubmit} loading={loading}>

                    <Grid columns='equal'>

                    <Divider horizontal>Administratif</Divider>


                        <Grid.Row>
                            <Grid.Column>
                                <Field name="nomJf" type="text" component={this.renderFieldInput} placeholder="Nom de jeune fille"/>
                                <Field name="nom" type="text" component={this.renderFieldInput} placeholder="Nom d'épouse"/>
                                <Field name="prenom" type="text" component={this.renderFieldInput} placeholder="Prénom"/>
                                <Grid columns='equal'>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Field name="dateNaissance" type="text" component={this.renderFieldDate} label="Date de naissance" onChange={this.dateNaissanceHandle} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Field>
                                                <Label>Age</Label>
                                                <Segment basic style={{padding:'9.5px', marginTop:'0px'}}>{age ? age + ' ans' : ''}</Segment>
                                            </Form.Field>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="telephone" type="text" component={this.renderFieldInputIcon} label="Téléphone" icon='phone'/>
                                <Field name="email" type="text" component={this.renderFieldInputIcon} label="Email" icon='at'/>
                                <Field name="adresse" type="textarea" component={this.renderFieldTextarea} label="Adresse"/>
                            </Grid.Column>

                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="activite" type="text" component={this.renderFieldInput} placeholder="Activité"/>
                                <Field name='activite' labels={['Sans profession', 'Mère au foyer', 'Recherche d\'emploi']} component={this.renderFieldRadioHorizontal} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='statut' label='Statut' labels={['Célibataire', 'En couple', 'Divorcée', 'Veuve']} component={this.renderFieldRadioHorizontal} onChange={this.statutRadioHandle} />
                                <Transition visible={showPartenaireForm} animation='scale' duration={500}>
                                    <Segment padded>
                                        <Label attached='top'>Partenaire</Label>
                                        <Grid columns='equal'>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Field name="partenaire.nom" type="text" component={this.renderFieldInput} placeholder="Nom"/>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Field name="partenaire.prenom" type="text" component={this.renderFieldInput} placeholder="Prénom"/>
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Grid columns='equal'>
                                                        <Grid.Row>
                                                            <Grid.Column>
                                                                <Field name="partenaire.dateNaissance" type="text" component={this.renderFieldDate} label="Date de naissance" onChange={this.dateNaissancePartenaireHandle} />
                                                            </Grid.Column>
                                                            <Grid.Column>
                                                                <Form.Field>
                                                                    <Label>Age</Label>
                                                                    <Segment basic style={{padding:'9.5px', marginTop:'0px'}}>{agePartenaire ? agePartenaire + ' ans' : ''}</Segment>
                                                                </Form.Field>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Field name="partenaire.activite" type="text" component={this.renderFieldInput} placeholder="Activité"/>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Segment>
                                </Transition>

                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="medecinTraitant.nom" type="text" component={this.renderFieldInput} placeholder="Médecin traitant"/>
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="medecinTraitant.ville" type="text" component={this.renderFieldInput} placeholder="Ville"/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Field name="sfGyneco.nom" type="text" component={this.renderFieldInput} placeholder="Sage femme / Gynécologue"/>
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="sfGyneco.ville" type="text" component={this.renderFieldInput} placeholder="Ville"/>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="specialistes" type="textarea" component={this.renderFieldTextarea} label="Autres spécialistes"/>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='allergies.ouinon' label='Allergies' labels={['oui', 'non']} component={this.renderFieldRadioHorizontal} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="allergies.autres" type="text" component={this.renderFieldTextarea} label="Autres" displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='groupeSanguin.groupe' label='Groupe sanguin' labels={['O', 'A', 'B', 'AB']} component={this.renderFieldRadioVertical} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name='groupeSanguin.rhesus' label='Rhésus' labels={['+', '-']} component={this.renderFieldRadioVertical} onChange={this.rhesusRadioHandle}/>
                            </Grid.Column>
                            <Grid.Column>
                                <Field name='groupeSanguin.carteAjour' label='Carte à jour' labels={['oui', 'non']} component={this.renderFieldRadioVertical} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Transition visible={showPereGroupeSanguinForm} animation='scale' duration={500}>
                                    <Segment padded>
                                        <Label attached='top'>Père</Label>
                                        <Grid columns='equal'>

                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Field name='groupeSanguin.pere.groupe' label='Groupe sanguin' labels={['O', 'A', 'B', 'AB']} component={this.renderFieldRadioVertical} />
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Field name='groupeSanguin.pere.rhesus' label='Rhésus' labels={['+', '-']} component={this.renderFieldRadioVertical} />
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Field name='groupeSanguin.pere.carteAjour' label='Carte à jour' labels={['oui', 'non']} component={this.renderFieldRadioVertical} />
                                                </Grid.Column>
                                            </Grid.Row>

                                        </Grid>
                                    </Segment>
                                </Transition>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='taille' placeholder='Taille' label={{basic: true, content: 'cm'}} labelPosition='right' component={this.renderFieldInput} onChange={this.calculImc} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="poids" placeholder='Poids'  label={{basic: true, content: 'kg'}} labelPosition='right' type="text" component={this.renderFieldInput} onChange={this.calculImc} />
                            </Grid.Column>
                            <Grid.Column>
                                <Form.Field>
                                    <Label>IMC</Label>
                                    <Segment basic style={{padding:'9.5px', marginTop:'0px'}}>{imc ? imc : ''}</Segment>
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='tabac.ouinon' label='Tabac' labels={['oui', 'non']} component={this.renderFieldRadioHorizontal} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="tabac.autres" type="text" component={this.renderFieldTextarea} label="Tabac" displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='alcool.ouinon' label='Alcool' labels={['oui', 'non']} component={this.renderFieldRadioHorizontal} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="alcool.autres" type="text" component={this.renderFieldTextarea} label="Alcool" displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='toxiques.ouinon' label='Toxiques' labels={['oui', 'non']} component={this.renderFieldRadioHorizontal} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="toxiques.autres" type="text" component={this.renderFieldTextarea} label="Toxiques" displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Divider horizontal>Antécédents familiaux</Divider>

                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <Grid columns='equal'>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Field name='antecedents.familiaux.aucun' label='Aucun' component={this.renderFieldCheckbox} />
                                                <Field name='antecedents.familiaux.diabete' label='Diabète' component={this.renderFieldCheckbox} />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Field name='antecedents.familiaux.obesite' label='Obésité' component={this.renderFieldCheckbox} />
                                                <Field name='antecedents.familiaux.hta' label='HTA' component={this.renderFieldCheckbox} />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Field name='antecedents.familiaux.cardiovasculaires' label='Cardiovasculaires' component={this.renderFieldCheckbox} />
                                                <Field name='antecedents.familiaux.cancershormonodependants' label='Cancers hormonodépendants' component={this.renderFieldCheckbox} />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>

                        <Divider horizontal>Antécédents médicaux</Divider>

                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <Grid columns='equal'>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Field name='antecedents.medicaux.aucun' label='Aucun' component={this.renderFieldCheckbox} />
                                                <Field name='antecedents.medicaux.asthme' label='Asthme' component={this.renderFieldCheckbox} />
                                                <Field name='antecedents.medicaux.migraines' label='Migraines' component={this.renderFieldCheckbox} />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Field name="antecedents.medicaux.autres" type="text" component={this.renderFieldTextarea} label="Autres" displayLabel={false} />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>

                        <Divider horizontal>Antécédents chirurgicaux</Divider>

                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <Grid columns='equal'>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Field name='antecedents.chirurgicaux.aucun' label='Aucun' component={this.renderFieldCheckbox} />
                                                <Field name='antecedents.chirurgicaux.appendicectomie' label='Appendicectomie' component={this.renderFieldCheckbox} />
                                                <Field name='antecedents.chirurgicaux.dds' label='DDS' component={this.renderFieldCheckbox} />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Field name="antecedents.chirurgicaux.autres" type="text" component={this.renderFieldTextarea} label="Autres"  displayLabel={false} />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>

                        <Divider horizontal>Antécédents gynécologiques</Divider>

                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <Grid columns='equal'>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Field name='antecedents.gynecologiques.aucun' label='Aucun' component={this.renderFieldCheckbox} />
                                                <Field name='antecedents.gynecologiques.kystesovaire' label="Kystes de l'ovaire" component={this.renderFieldCheckbox} />
                                                <Field name='antecedents.gynecologiques.fibromesuterins' label='Fibromes utérins' component={this.renderFieldCheckbox} />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Field name='antecedents.gynecologiques.endometriose' label='Endométriose' component={this.renderFieldCheckbox} />
                                                <Field name='antecedents.gynecologiques.hysterectomie' label='Hystérectomie' component={this.renderFieldCheckbox} />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Field name="antecedents.gynecologiques.autres" type="text" component={this.renderFieldTextarea} label="Autres"  displayLabel={false} />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>

                        <Divider/>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='cyclesreguliers.ouinon' label='Cycles réguliers' labels={['oui', 'non']} component={this.renderFieldRadioHorizontal} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="cyclesreguliers.autres" type="text" component={this.renderFieldTextarea} label="Cycles réguliers" displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='vaccinationhpv' label='Vaccination HPV' labels={['oui', 'non', 'en cours']} component={this.renderFieldRadioHorizontal} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='dernierfrottis.date' component={this.renderFieldDate} label="Dernier frottis" />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="dernierfrottis.resultat" type="text" component={this.renderFieldTextarea} label="Résultat"  displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Form.Field>
                                    <Grid columns='equal'>
                                        <Label>Contraception</Label>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Field name='contraception.aucun' label='Aucun' component={this.renderFieldCheckbox} />
                                                <Field name='contraception.estroprogestatifs' label='Estroprogestatifs' component={this.renderFieldCheckbox} />
                                                <Field name='contraception.microprogestatifs' label='Microprogestatifs' component={this.renderFieldCheckbox} />
                                                <Field name='contraception.monoprogestatifs' label='Monoprogestatifs' component={this.renderFieldCheckbox} />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Field name='contraception.diuSiu' label='DIU / SIU' component={this.renderFieldCheckbox} />
                                                <Field name='contraception.localeBarriere' label='Locale / barrière' component={this.renderFieldCheckbox} />
                                                <Field name='contraception.naturelle' label='Naturelle' component={this.renderFieldCheckbox} />
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Field name="contraception.autre" type="text" component={this.renderFieldTextarea} label="Autre"  displayLabel={false} />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form.Field>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="age.premieresregles" type="text" component={this.renderFieldInput} placeholder="Age premières règles" />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="age.premiersrapports" type="text" component={this.renderFieldInput} placeholder="Age premiers rapports" />
                            </Grid.Column>
                        </Grid.Row>


                        <Grid.Row>
                            <Grid.Column textAlign='center'>
                                <Button primary onClick={() => handleSubmit} disabled={pristine || submitting}>Enregistrer</Button>
                            </Grid.Column>
                        </Grid.Row>

                    </Grid>
                </Form>

            </div>
        )
    }
}



function calculAge(dateNaissance) {
    if (!dateNaissance) {
        return '';
    }

    var td = new Date();// Le date d'ouverture de la page (aujourd'hui)

    if (dateNaissance instanceof Date) {
        var an=dateNaissance.getFullYear(); // l'année (les quatre premiers caractères de la chaîne à partir de 6)
        var mois=dateNaissance.getMonth()+1;// On selectionne le mois de la date de naissance
        var day=dateNaissance.getDate(); // On selectionne la jour de la date de naissance
    } else {
        var an=dateNaissance.substr(0,4); // l'année (les quatre premiers caractères de la chaîne à partir de 6)
        var mois=dateNaissance.substr(5,2);// On selectionne le mois de la date de naissance
        var day= dateNaissance.substr(8,2); // On selectionne la jour de la date de naissance
    }

    var age=td.getFullYear()-an; // l'âge du patient

    var mMois=td.getMonth()+1-mois; // On calcul  le mois de la date - le mois de la date de naissance


    if(mMois < 0) // s'il est strictement inferieur a 0
    {
        age=age-1; // On enléve 1 ans a l'age
    }
    else
    {
        if(mMois === 0)// s'il égal 0 on est sur le même mois
        {
            var mDate=td.getDate()-day;
            if(mDate < 0)
            {
                age=age-1;
            }

        }
    }

    return age; // que l'on place dans le input d'id Age
}

export default reduxForm({form: 'patiente', validate})(PatienteForm);