import React from 'react';
import { Card } from 'semantic-ui-react';
import PatienteCard from './patiente-card';

export default function PatienteList({patientes, deletePatiente}){

    const cards = () => {
        return patientes.map(patiente => {
            return (
                <PatienteCard
                    key={patiente._id}
                    patiente={patiente}
                    deletePatiente={deletePatiente}/>
            )
        })
    }

    return (
        <Card.Group>
            { cards() }
        </Card.Group>
    )
}