import React, { Component} from 'react';
import { connect } from 'react-redux';
import { updatePatiente } from '../actions/patiente-actions';
import MenuConsultationsListe from './menu_consultations_liste';


class MenuConsultations extends Component {

    render() {

        return (
            <MenuConsultationsListe patiente={this.props.patiente} />
        )
    }
}

function mapStateToProps(state) {
    return {
        patiente: state.patienteStore.patiente,
    }
}

export default connect(mapStateToProps, {updatePatiente})(MenuConsultations);

