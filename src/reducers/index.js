import { combineReducers } from 'redux';
import PatienteReducer from './patiente-reducer';
import { reducer as formReducer } from 'redux-form';

const reducers = {
    patienteStore: PatienteReducer,
    form: formReducer
}

const rootReducer = combineReducers(reducers);

export default rootReducer;