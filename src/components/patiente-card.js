import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

export default function PatienteCard({patiente, deletePatiente}) {
    return (
        <Card>
            <Card.Content>
                <Card.Header>
                    <Icon name='user outline'/> {patiente.nomJf} {patiente.nom} {patiente.prenom}
                </Card.Header>
                <Card.Description>
                    <p><Icon name='phone'/> {patiente.telephone}</p>
                    <p><Icon name='mail outline'/> {patiente.email}</p>
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <div className="ui two buttons">
                    <Link to={`/patientes/edit/${patiente._id}`} className="ui basic button green">Modifier</Link>
                    <Button basic color="red" onClick={() => deletePatiente(patiente._id)} >Supprimer</Button>
                </div>
            </Card.Content>
        </Card>
    )
}

PatienteCard.propTypes = {
    patiente: PropTypes.object.isRequired
}