import React, { Component} from 'react';
import { connect } from 'react-redux';
import _ from 'lodash'
import { Redirect } from 'react-router-dom';
import { Search, Label } from 'semantic-ui-react'
import { fetchPatientes } from '../actions/patiente-actions';
import * as CommonFields from '../components/commonFields';

// const resultRenderer = ({ nomJf, nom, prenom }) => <Label content={CommonFields.fullName(nomJf, nom, prenom)} />
const resultRenderer = ({ nomJf, nom, prenom }) => <label>{CommonFields.fullName(nomJf, nom, prenom)}</label>

class PatienteSearchForm extends Component {

    constructor () {
        super();
        this.state = {
            fireRedirect: false
        }
    }

    componentDidMount() {
        this.props.fetchPatientes();
    }

    resetComponent = () => this.setState({
        isLoading: false,
        results: [],
        value: '',
        patienteId: ''
    })

    handleResultSelect = (e, { result }) => {
        // on ne redirige pas si on est sur le même ID client
        if (!window.location.pathname.endsWith('/'+result._id)) {
            this.setState({ fireRedirect: true, value: '', patienteId: result._id })
        }
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ fireRedirect: false, isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = result => re.test(CommonFields.fullName(result.nomJf, result.nom, result.prenom))

            this.setState({
                isLoading: false,
                results: _.filter(this.props.patientes, isMatch),
            })
        }, 200)
    }

    render() {
        const { isLoading, value, results, patienteId, fireRedirect } = this.state

        return (
            <div>
                {fireRedirect && patienteId && (
                    <Redirect to={'/patientes/view_redirect/'+patienteId}/>
                )}
                <Search
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={this.handleSearchChange}
                    results={results}
                    value={value}
                    {...this.props}
                    resultRenderer={resultRenderer}
                    noResultsMessage='Aucune patiente trouvée...'
                    placeholder='Chercher une patiente'
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        patientes : state.patienteStore.patientes
    }
}

export default connect(mapStateToProps, {fetchPatientes})(PatienteSearchForm);
