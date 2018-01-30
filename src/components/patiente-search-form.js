import React, { Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Redirect } from 'react-router-dom';

import { Search, Label } from 'semantic-ui-react'

import { fetchPatientes } from '../actions/patiente-actions';

const resultRenderer = ({ nomJf }) => <Label content={nomJf} />

resultRenderer.propTypes = {
    nomJf: PropTypes.string,
    _id: PropTypes.string,
}

class PatienteSearchForm extends Component {

    constructor () {
        super();
        this.state = {
            fireRedirect: false
        }
    }

    componentWillRecieveProps(nextProps) {
        this.setState({ fireRedirect: false })
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
        console.log(result._id);
        this.setState({ fireRedirect: true, value: '', patienteId: result._id })
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = result => re.test(result.nomJf)

            this.setState({
                isLoading: false,
                results: _.filter(this.props.patientes, isMatch),
            })
        }, 500)
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
                    noResultsMessage='Aucun résultat'
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
