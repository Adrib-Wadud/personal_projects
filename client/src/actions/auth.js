import axios from 'axios';
import {setAlert} from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT, 
    CLEAR_PROFILE

} from './types';
import setAuthToken from '../utils/setAuthToken';

export const loadUser = () => async dispatch=>{
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    // const config = {
    //     headers: {
    //         'Access-Control-Allow-Origin': '*'
    //     }
    // }

    try {
        const res = await axios.get('http://localhost:5000/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (err) {
        
        console.error(err.message)
        dispatch({
            type: AUTH_ERROR

        })
    }
}

export const register = ({ name, email, password})=> async dispatch => {
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({name, email, password});
    try {
        const res = await axios.post('http://localhost:5000/api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
        
    } catch (err) {
        const errors = err.response.data.errors;
        //data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg)));
        }

        dispatch({
            type: REGISTER_FAIL
        });
    }
}

//Login
export const login = ({ email, password})=> async dispatch => {
    const config = {
        headers:{
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({email, password});
    try {
        const res = await axios.post('http://localhost:5000/api/auth', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
        
    } catch (err) {
        const errors = err.response.data.errors;
        //data.errors
        if(errors){
            errors.forEach(error=>dispatch(setAlert(error.msg)));
        }

        dispatch({
            type: LOGIN_FAIL
        });
    }
}

//Logout / Clear profile
export const logout = ()=>dispatch =>{
    dispatch({type: CLEAR_PROFILE})
    dispatch({type: LOGOUT})
    
}