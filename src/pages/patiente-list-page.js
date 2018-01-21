import React, { Component} from 'react';
import { connect } from 'react-redux';
import PatienteList from '../components/patiente-list';
import { fetchPatientes, deletePatiente } from '../actions/patiente-actions';


class PatienteListPage extends Component {
    componentDidMount() {
        this.props.fetchPatientes();
    }

    render() {
        return (
            <div>
                <h1>Liste des patientes</h1>
                <PatienteList patientes={this.props.patientes} deletePatiente={this.props.deletePatiente}/>
            </div>
        )
    }
}

// Make contacts  array available in  props
function mapStateToProps(state) {
    return {
        patientes : state.patienteStore.patientes
    }
}

export default connect(mapStateToProps, {fetchPatientes, deletePatiente})(PatienteListPage);