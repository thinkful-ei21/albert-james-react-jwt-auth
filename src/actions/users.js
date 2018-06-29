import {SubmissionError} from 'redux-form';

import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils';

// async action
export const registerUser = user => dispatch => { // see below note for this
    return fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .catch(err => {
            const {reason, message, location} = err;
            if (reason === 'ValidationError') {
                // Convert ValidationErrors into SubmissionErrors for Redux Form
                return Promise.reject(
                    new SubmissionError({
                        [location]: message
                    })
                );
            }
        });
};

// sync action
export const syncAction = (payload) => {
    return {
        action: 'some action',
        property: payload
    };
}

/*-------------------------------------------------------------------------------------
thunk middleware allows us to call a function inside an action creator

thunk picks up the action and checks if the action is an object
if it is, it carries on normally, otherwise,
if it's a function, thunk will call it, passing dispatch in as argument

dispatch function comes from thunk middleware, passed in as an argument
-------------------------------------------------------------------------------------*/

// fetch() returns a promise, comes back with a response, or res,
