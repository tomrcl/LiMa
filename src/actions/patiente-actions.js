import { client } from './';

const url = '/patientes';

export function fetchPatientes(){
    return dispatch => {
        dispatch({
            type: 'FETCH_PATIENTES',
            payload: client.get(url)
        })
    }
}

export function newPatiente() {
    return dispatch => {
        dispatch({
            type: 'NEW_PATIENTE'
        })
    }
}

export function savePatiente(patiente) {
    // pour ne mettre qu'une seule fois la date de création
    patiente.createdAt = new Date();

    return dispatch => {
        return dispatch({
            type: 'SAVE_PATIENTE',
            payload: client.post(url, patiente)
        })
    }
}

export function fetchPatiente(_id) {
    return dispatch => {
        return dispatch({
            type: 'FETCH_PATIENTE',
            payload: client.get(`${url}/${_id}`)
        })
    }
}

export function updatePatiente(patiente) {
    return dispatch => {
        return dispatch({
            type: 'UPDATE_PATIENTE',
            payload: client.put(`${url}/${patiente._id}`, patiente)
        })
    }
}

export function deletePatiente(_id) {
    return dispatch => {
        return dispatch({
            type: 'DELETE_PATIENTE',
            payload: client.delete(`${url}/${_id}`)
        })
    }
}