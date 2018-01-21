import React, { Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Redirect, Link } from 'react-router-dom';

import { Search, Label } from 'semantic-ui-react'

import { fetchPatientes } from '../actions/patiente-actions';

const resultRenderer = ({ nomJf }) => <Label content={nomJf} />
// const resultRenderer = ({ nomJf, _id }) => <Link to={'/patientes/view/' + _id} >{nomJf}</Link>

resultRenderer.propTypes = {
    nomJf: PropTypes.string,
    _id: PropTypes.string,
}

class PatienteSearchForm extends Component {

    constructor(props) {
        super(props);

        console.log('cons');
    }

    componentWillMount() {
        console.log('will mount');
        this.resetComponent()
    }

    resetComponent = () => this.setState({
        isLoading: false,
        results: [],
        value: '',
        redirect: false,
    })

    handleResultSelect = (e, { result }) => {
         this.setState({ redirect: true, value: result._id })
    }

    handleSearchChange = (e, { value }) => {
        this.props.fetchPatientes();
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
        const { isLoading, value, results, redirect } = this.state

        return (
            <div>
            {
                redirect ?
                    <Redirect to={'/patientes/view/' + value} />
                    :
                <Search
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={this.handleSearchChange}
                    results={results}
                    value={value}
                    {...this.props}
                    resultRenderer={resultRenderer}
                />
            }
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
