import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';

class PatienteViewRedirect extends Component {
    state = {
        patienteId: '',
        fireRedirect: false
    }

    componentDidMount() {
        const { _id } = this.props.match.params;
        if(_id){
            this.setState({patienteId: _id, fireRedirect: true});
        }
    }

    render() {
        const { patienteId, fireRedirect } = this.state;
        console.log('redirect !')

        return (
            fireRedirect &&
            <Redirect to={'/patientes/view/'+patienteId} />
        )
    }
}


export default PatienteViewRedirect;
