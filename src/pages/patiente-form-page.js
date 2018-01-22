import React, { Component} from 'react';
import { Redirect } from 'react-router';
import { SubmissionError } from 'redux-form';
import { connect } from 'react-redux';
import { newPatiente, savePatiente, fetchPatiente, updatePatiente } from '../actions/patiente-actions';
import PatienteForm from '../components/patiente-form';

class PatienteFormPage extends Component {
    state = {
        redirect: false
    }

    componentDidMount() {
        const { _id } = this.props.match.params;
        if(_id){
            this.props.fetchPatiente(_id)
        } else {
            this.props.newPatiente();
        }
    }

    submit = (patiente) => {
        if(!patiente._id) {
            return this.props.savePatiente(patiente)
                .then(response => this.setState({ redirect:true }))
                .catch(err => {
                    throw new SubmissionError(this.props.errors)
                })
        } else {
            return this.props.updatePatiente(patiente)
                .then(response => this.setState({ redirect:true }))
                .catch(err => {
                    throw new SubmissionError(this.props.errors)
                })
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.redirect ?
                        <Redirect to={`/patientes/view/${this.props.patiente._id}`} /> :
                        <PatienteForm patiente={this.props.patiente} loading={this.props.loading} onSubmit={this.submit} />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        patiente: state.patienteStore.patiente,
        errors: state.patienteStore.errors
    }
}

export default connect(mapStateToProps, {newPatiente, savePatiente, fetchPatiente, updatePatiente})(PatienteFormPage);