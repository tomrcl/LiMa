import React, { Component} from 'react';
import { Icon, Table, Header } from 'semantic-ui-react';

// date: Date,
//     terme: String,
//     grossesse: String,
//     lieu: String,
//     modeAccouchement: String,
//     nouveauNe: String,
//     allaitement: String

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

class AntecedentsObsTable extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
        <Table basic='very' celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Terme</Table.HeaderCell>
                    <Table.HeaderCell>Grossesse</Table.HeaderCell>
                    <Table.HeaderCell>Lieu</Table.HeaderCell>
                    <Table.HeaderCell>Mode accouchement</Table.HeaderCell>
                    <Table.HeaderCell>Nouveau né</Table.HeaderCell>
                    <Table.HeaderCell>Allaitement</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {dataTest.antecedents.obstetricaux.map( obs => (
                    <Table.Row>
                        <Table.Cell>
                            <Header as='h4' image>
                                <Header.Content>
                                    {obs.date}
                                    <Header.Subheader>Human Resources</Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Table.Cell>
                        <Table.Cell>
                            {obs.terme}
                        </Table.Cell>
                        <Table.Cell>
                            {obs.grossesse}
                        </Table.Cell>
                        <Table.Cell>
                            {obs.lieu}
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
                        <Table.Cell textAlign='center'>
                            <Icon name='edit'/>
                            <Icon name='delete'/>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
        )
    }
}

export default AntecedentsObsTable;