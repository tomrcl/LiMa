import React, { Component} from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { fetchPatiente } from '../actions/patiente-actions';

class PatienteViewPage extends Component {

    // componentWillReceiveProps = (nextProps) => { // Receive Contact data Asynchronously
    //     console.log('receveid');
    //     const { patiente } = nextProps;
    //     console.log(patiente._id)
    //     if(patiente._id !== this.props.patiente._id) { // Initialize form only once
    //         this.props.fetchPatiente(patiente._id)
    //     }
    // }

    // componentDidUpdate() {
    //     console.log('didupdate')
    //     const { _id } = this.props.match.params;
    //     console.log(_id)
    //     if(_id !== this.props.patiente._id) { // Initialize form only once
    //         this.props.fetchPatiente(_id)
    //     }
    // }

    componentDidMount() {
        console.log('VIEW')

        const { _id } = this.props.match.params;
        if(_id){
            this.props.fetchPatiente(_id)
        }
    }

    render() {
        return (
            <div>
                {this.props.patiente.nomJf}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        patiente: state.patienteStore.patiente,
    }
}

export default connect(mapStateToProps, {fetchPatiente})(PatienteViewPage);