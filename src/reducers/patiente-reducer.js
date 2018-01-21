const defaultState = {
    patientes: [],
    patiente: {},
    loading: false,
    errors: {}
}

export default (state=defaultState, action={}) => {
    switch (action.type) {
        case 'FETCH_PATIENTES': {
            return {
                ...state,
                patientes: action.payload
            }
        }
        case 'FETCH_PATIENTES_FULFILLED': {
            return {
                ...state,
                patientes: action.payload.data.data || action.payload.data // in case pagination is disabled
            }
        }
        case 'NEW_PATIENTE': {
            return {
                ...state,
                patiente: {}
            }
        }
        case 'SAVE_PATIENTE_PENDING': {
            return {
                ...state,
                loading: true
            }
        }

        case 'SAVE_PATIENTE_FULFILLED': {
            return {
                ...state,
                patientes: [...state.patientes, action.payload.data],
                errors: {},
                loading: false
            }
        }

        case 'SAVE_PATIENTE_REJECTED': {
            const data = action.payload.response.data;
            const errors = { global: data.message, ...data.errors };
            return {
                ...state,
                errors: errors,
                loading: false
            }
        }

        case 'FETCH_PATIENTE_PENDING': {
            return {
                ...state,
                loading: true,
                patiente: {}
            }
        }

        case 'FETCH_PATIENTE_FULFILLED': {
            return {
                ...state,
                patiente: action.payload.data,
                errors: {},
                loading: false
            }
        }

        case 'UPDATE_PATIENTE_PENDING': {
            return {
                ...state,
                loading: true
            }
        }

        case 'UPDATE_PATIENTE_FULFILLED': {
            const patiente = action.payload.data;
            return {
                ...state,
                patientes: state.patientes.map(item => item._id === patiente._id ? patiente : item),
                errors: {},
                loading: false
            }
        }

        case 'UPDATE_PATIENTE_REJECTED': {
            const data = action.payload.response.data;
            const errors = { global: data.message, ...data.errors };
            return {
                ...state,
                errors: errors,
                loading: false
            }
        }
        case 'DELETE_PATIENTE_FULFILLED': {
            const _id = action.payload.data._id;
            return {
                ...state,
                patientes: state.patientes.filter(item => item._id !== _id)
            }
        }

        default:
            return state;
    }
}