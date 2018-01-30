import React, { Component } from 'react';
import {Prompt} from 'react-router-dom'
import { Form, Button, Transition, Segment, Grid, Divider, Label, Container } from 'semantic-ui-react';
import { Field, reduxForm } from 'redux-form';
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import 'react-widgets/dist/css/react-widgets.css';
import * as CommonFields from './commonFields';

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

class PatienteForm extends Component {

    state = {
        showPartenaireForm: false,
        age: '',
        agePartenaire: '',
        showPereGroupeSanguinForm: false,
        imc: ''
    }

    statutRadioHandle = ( value ) => {
        this.setState({ showPartenaireForm: value[0] === 'E' });
    }

    rhesusRadioHandle = ( value ) => {
        this.setState({ showPereGroupeSanguinForm: value[0] === '-' });
    }

    dateNaissanceHandle = ( e, value ) => {
        this.setState({ age: CommonFields.calculAge(value) });
    }

    dateNaissancePartenaireHandle = ( e, value ) => {
        this.setState({ agePartenaire: CommonFields.calculAge(value) });
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
                age: CommonFields.calculAge(patiente.dateNaissance),
                agePartenaire: patiente.partenaire ? CommonFields.calculAge(patiente.partenaire.dateNaissance) : '',
                showPereGroupeSanguinForm : patiente.groupeSanguin ? patiente.groupeSanguin.rhesus === '-' : '',
                imc: patiente.poids && patiente.taille ? ((patiente.poids / (patiente.taille*patiente.taille))*10000).toFixed(2) : ''
            });
        }
    }

    render() {
        const {handleSubmit, pristine, submitting, loading} = this.props;
        const {showPartenaireForm, age, agePartenaire, showPereGroupeSanguinForm, imc} = this.state;

        return (
            <Container>
                <Prompt
                    when={!pristine}
                    message='Etes-vous sur de vouloir quitter le formulaire ?'
                />

                <h1 style={{marginTop: "1em"}}>{this.props.patiente._id ? 'Modifier fiche '+ CommonFields.fullNameWithDate(this.props.patiente) : 'Nouvelle patiente'}</h1>

                <Form onSubmit={handleSubmit} loading={loading}>

                    <Grid columns='equal'>

                        <Divider horizontal>Administratif</Divider>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="nomJf" type="text" component={CommonFields.renderFieldInput} placeholder="Nom de jeune fille"/>
                                <Field name="nom" type="text" component={CommonFields.renderFieldInput} placeholder="Nom d'épouse"/>
                                <Field name="prenom" type="text" component={CommonFields.renderFieldInput} placeholder="Prénom"/>
                                <Grid columns='equal'>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Field name="dateNaissance" type="text" component={CommonFields.renderFieldDate} label="Date de naissance" onChange={this.dateNaissanceHandle} />
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
                                <Field name="telephone" type="text" component={CommonFields.renderFieldInputIcon} label="Téléphone" icon='phone'/>
                                <Field name="email" type="text" component={CommonFields.renderFieldInputIcon} label="Email" icon='at'/>
                                <Field name="adresse" type="textarea" component={CommonFields.renderFieldTextarea} label="Adresse"/>
                            </Grid.Column>

                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="activite" type="text" component={CommonFields.renderFieldInput} placeholder="Activité"/>
                                <Field name='activite' labels={['Sans profession', 'Mère au foyer', 'Recherche d\'emploi']} component={CommonFields.renderFieldRadioHorizontal} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='statut' label='Statut' labels={['Célibataire', 'En couple', 'Divorcée', 'Veuve']} component={CommonFields.renderFieldRadioHorizontal} onChange={this.statutRadioHandle} />
                                <Transition visible={showPartenaireForm ? showPartenaireForm : false} animation='scale' duration={500}>
                                    <Segment padded>
                                        <Label attached='top'>Partenaire</Label>
                                        <Grid columns='equal'>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Field name="partenaire.nom" type="text" component={CommonFields.renderFieldInput} placeholder="Nom"/>
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Field name="partenaire.prenom" type="text" component={CommonFields.renderFieldInput} placeholder="Prénom"/>
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Grid columns='equal'>
                                                        <Grid.Row>
                                                            <Grid.Column>
                                                                <Field name="partenaire.dateNaissance" type="text" component={CommonFields.renderFieldDate} label="Date de naissance" onChange={this.dateNaissancePartenaireHandle} />
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
                                                    <Field name="partenaire.activite" type="text" component={CommonFields.renderFieldInput} placeholder="Activité"/>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Segment>
                                </Transition>

                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="medecinTraitant.nom" type="text" component={CommonFields.renderFieldInput} placeholder="Médecin traitant"/>
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="medecinTraitant.ville" type="text" component={CommonFields.renderFieldInput} placeholder="Ville"/>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Field name="sfGyneco.nom" type="text" component={CommonFields.renderFieldInput} placeholder="Sage femme / Gynécologue"/>
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="sfGyneco.ville" type="text" component={CommonFields.renderFieldInput} placeholder="Ville"/>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="specialistes" type="textarea" component={CommonFields.renderFieldTextarea} label="Autres spécialistes"/>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='allergies.ouinon' label='Allergies' labels={['oui', 'non']} component={CommonFields.renderFieldRadioHorizontal} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="allergies.autres" type="text" component={CommonFields.renderFieldTextarea} label="Autres" displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='groupeSanguin.groupe' label='Groupe sanguin' labels={['O', 'A', 'B', 'AB']} component={CommonFields.renderFieldRadioVertical} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name='groupeSanguin.rhesus' label='Rhésus' labels={['+', '-']} component={CommonFields.renderFieldRadioVertical} onChange={this.rhesusRadioHandle}/>
                            </Grid.Column>
                            <Grid.Column>
                                <Field name='groupeSanguin.carteAjour' label='Carte à jour' labels={['oui', 'non']} component={CommonFields.renderFieldRadioVertical} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Transition visible={showPereGroupeSanguinForm ? showPereGroupeSanguinForm : false} animation='scale' duration={500}>
                                    <Segment padded>
                                        <Label attached='top'>Père</Label>
                                        <Grid columns='equal'>

                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Field name='groupeSanguin.pere.groupe' label='Groupe sanguin' labels={['O', 'A', 'B', 'AB']} component={CommonFields.renderFieldRadioVertical} />
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Field name='groupeSanguin.pere.rhesus' label='Rhésus' labels={['+', '-']} component={CommonFields.renderFieldRadioVertical} />
                                                </Grid.Column>
                                                <Grid.Column>
                                                    <Field name='groupeSanguin.pere.carteAjour' label='Carte à jour' labels={['oui', 'non']} component={CommonFields.renderFieldRadioVertical} />
                                                </Grid.Column>
                                            </Grid.Row>

                                        </Grid>
                                    </Segment>
                                </Transition>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='taille' placeholder='Taille' label={{basic: true, content: 'cm'}} labelPosition='right' component={CommonFields.renderFieldInput} onChange={this.calculImc} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="poids" placeholder='Poids'  label={{basic: true, content: 'kg'}} labelPosition='right' type="text" component={CommonFields.renderFieldInput} onChange={this.calculImc} />
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
                                <Field name='tabac.ouinon' label='Tabac' labels={['oui', 'non']} component={CommonFields.renderFieldRadioHorizontal} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="tabac.autres" type="text" component={CommonFields.renderFieldTextarea} label="Tabac" displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='alcool.ouinon' label='Alcool' labels={['oui', 'non']} component={CommonFields.renderFieldRadioHorizontal} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="alcool.autres" type="text" component={CommonFields.renderFieldTextarea} label="Alcool" displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='toxiques.ouinon' label='Toxiques' labels={['oui', 'non']} component={CommonFields.renderFieldRadioHorizontal} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="toxiques.autres" type="text" component={CommonFields.renderFieldTextarea} label="Toxiques" displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Divider horizontal>Antécédents familiaux</Divider>

                        <Grid.Row>
                            <Grid.Column>
                                <Grid columns='equal'>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Field name='antecedents.familiaux.aucun' label='Aucun' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='antecedents.familiaux.diabete' label='Diabète' component={CommonFields.renderFieldCheckbox} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Field name='antecedents.familiaux.obesite' label='Obésité' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='antecedents.familiaux.hta' label='HTA' component={CommonFields.renderFieldCheckbox} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Field name='antecedents.familiaux.cardiovasculaires' label='Cardiovasculaires' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='antecedents.familiaux.cancershormonodependants' label='Cancers hormonodépendants' component={CommonFields.renderFieldCheckbox} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>

                        <Divider horizontal>Antécédents médicaux</Divider>

                        <Grid.Row>
                            <Grid.Column>
                                <Grid columns='equal'>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Field name='antecedents.medicaux.aucun' label='Aucun' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='antecedents.medicaux.asthme' label='Asthme' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='antecedents.medicaux.migraines' label='Migraines' component={CommonFields.renderFieldCheckbox} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Field name="antecedents.medicaux.autres" type="text" component={CommonFields.renderFieldTextarea} label="Autres" displayLabel={false} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>

                        <Divider horizontal>Antécédents chirurgicaux</Divider>

                        <Grid.Row>
                            <Grid.Column>
                                <Grid columns='equal'>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Field name='antecedents.chirurgicaux.aucun' label='Aucun' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='antecedents.chirurgicaux.appendicectomie' label='Appendicectomie' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='antecedents.chirurgicaux.dds' label='DDS' component={CommonFields.renderFieldCheckbox} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Field name="antecedents.chirurgicaux.autres" type="text" component={CommonFields.renderFieldTextarea} label="Autres"  displayLabel={false} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>

                        <Divider horizontal>Antécédents gynécologiques</Divider>

                        <Grid.Row>
                            <Grid.Column>
                                <Grid columns='equal'>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Field name='antecedents.gynecologiques.aucun' label='Aucun' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='antecedents.gynecologiques.kystesovaire' label="Kystes de l'ovaire" component={CommonFields.renderFieldCheckbox} />
                                            <Field name='antecedents.gynecologiques.fibromesuterins' label='Fibromes utérins' component={CommonFields.renderFieldCheckbox} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Field name='antecedents.gynecologiques.endometriose' label='Endométriose' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='antecedents.gynecologiques.hysterectomie' label='Hystérectomie' component={CommonFields.renderFieldCheckbox} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Field name="antecedents.gynecologiques.autres" type="text" component={CommonFields.renderFieldTextarea} label="Autres"  displayLabel={false} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>

                        <Divider/>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='cyclesreguliers.ouinon' label='Cycles réguliers' labels={['oui', 'non']} component={CommonFields.renderFieldRadioHorizontal} />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="cyclesreguliers.autres" type="text" component={CommonFields.renderFieldTextarea} label="Cycles réguliers" displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='vaccinationhpv' label='Vaccination HPV' labels={['oui', 'non', 'en cours']} component={CommonFields.renderFieldRadioHorizontal} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name='dernierfrottis.date' component={CommonFields.renderFieldDate} label="Dernier frottis" />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="dernierfrottis.resultat" type="text" component={CommonFields.renderFieldTextarea} label="Résultat"  displayLabel={false} />
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Grid columns='equal'>
                                    <Label>Contraception</Label>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Field name='contraception.aucun' label='Aucun' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='contraception.estroprogestatifs' label='Estroprogestatifs' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='contraception.microprogestatifs' label='Microprogestatifs' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='contraception.monoprogestatifs' label='Monoprogestatifs' component={CommonFields.renderFieldCheckbox} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Field name='contraception.diuSiu' label='DIU / SIU' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='contraception.localeBarriere' label='Locale / barrière' component={CommonFields.renderFieldCheckbox} />
                                            <Field name='contraception.naturelle' label='Naturelle' component={CommonFields.renderFieldCheckbox} />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Field name="contraception.autre" type="text" component={CommonFields.renderFieldTextarea} label="Autre"  displayLabel={false} />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>

                        <Grid.Row>
                            <Grid.Column>
                                <Field name="age.premieresregles" type="text" component={CommonFields.renderFieldInput} placeholder="Age premières règles" />
                            </Grid.Column>
                            <Grid.Column>
                                <Field name="age.premiersrapports" type="text" component={CommonFields.renderFieldInput} placeholder="Age premiers rapports" />
                            </Grid.Column>
                        </Grid.Row>


                        <Grid.Row>
                            <Grid.Column textAlign='center'>
                                <Button primary onClick={() => handleSubmit} disabled={pristine || submitting}>Enregistrer</Button>
                            </Grid.Column>
                        </Grid.Row>

                    </Grid>
                </Form>

            </Container>
        )
    }
}

export default reduxForm({form: 'patiente', validate})(PatienteForm);