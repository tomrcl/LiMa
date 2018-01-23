import React from 'react';

import { Form, Input, Checkbox, Grid, Radio, TextArea, Icon, Label } from 'semantic-ui-react';
import classnames from 'classnames';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

const dateFormats = [
    'DD/MM/YYYY',
    'DD/MM/YY',
    'DDMMYY',
    'DDMMYYYY'
];

export const renderFieldInput = ({input, placeholder, type, icon, label, labelPosition, meta: {touched, error}}) => (
    <Form.Field className={classnames({error: touched && error})}>
        {placeholder &&
        <Label>{placeholder}</Label>
        }
        <Input {...input} placeholder={placeholder} type={type} label={label} labelPosition={labelPosition}/>
        {touched && error && <span className="error">{error.message}</span>}
    </Form.Field>
)

export const renderFieldInputIcon = ({input, label, type, icon, meta: {touched, error}}) => (
    <Form.Field className={classnames({error: touched && error})}>
        <Label>{label}</Label>
        <Input {...input} placeholder={label} type={type} iconPosition='left'>
            <Icon name={icon} />
            <input/>
        </Input>
        {touched && error && <span className="error">{error.message}</span>}
    </Form.Field>
)

export const renderFieldTextarea = ({input, label, displayLabel=true, type, meta: {touched, error}}) => (
    <Form.Field className={classnames({error: touched && error})}>
        {displayLabel &&
        <Label>{label}</Label>
        }
        <TextArea {...input} placeholder={label}/>
        {touched && error && <span className="error">{error.message}</span>}
    </Form.Field>
)

export const renderFieldDate = ({input, name, label, meta: {touched, error}}) => (
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

export const renderFieldCheckbox = ({ input, label, meta: {touched, error}}) => (
    <Form.Field className={classnames({error: touched && error})}>
        <Checkbox
            label={label}
            checked={input.value ? true : false}
            onChange={(e, { checked }) => input.onChange(checked)}
        />
    </Form.Field>
)

export const renderFieldRadioHorizontal = ({ input, label, labels, name, meta: {touched, error}}) => (
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

export const renderFieldRadioVertical = ({ input, label, labels, name, meta: {touched, error}}) => (
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

export function fullName(patiente) {
    const age = calculAge(patiente.dateNaissance);

    return patiente.nomJf +
        ' ' + patiente.nom +
        ' ' + patiente.prenom +
        ' (' + age + ' ans)'
}

export function calculAge(dateNaissance) {
    if (!dateNaissance) {
        return '';
    }

    var td = new Date();// Le date d'ouverture de la page (aujourd'hui)

    var an;
    var mois;
    var jour;

    if (dateNaissance instanceof Date) {
        an=dateNaissance.getFullYear(); // l'année (les quatre premiers caractères de la chaîne à partir de 6)
        mois=dateNaissance.getMonth()+1;// On selectionne le mois de la date de naissance
        jour=dateNaissance.getDate(); // On selectionne la jour de la date de naissance
    } else {
        an=dateNaissance.substr(0,4); // l'année (les quatre premiers caractères de la chaîne à partir de 6)
        mois=dateNaissance.substr(5,2);// On selectionne le mois de la date de naissance
        jour= dateNaissance.substr(8,2); // On selectionne la jour de la date de naissance
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
            var mDate=td.getDate()-jour;
            if(mDate < 0)
            {
                age=age-1;
            }

        }
    }

    return age; // que l'on place dans le input d'id Age
}