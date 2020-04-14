import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';
import { useGlobalStore } from "./GlobalStore";
import API from "./API";

function RegisterPage(){
    // DECLARATIVE FORM OF PROGRAMMING
    const [ globalData, dispatch ] = useGlobalStore();
    const [ userData, setUserData ] = useState({ name: "", email: "", password: ""});
    const [ isRegistered, setIsRegistered ] = useState( false );

    const inputEmail = useRef();
    const inputPassword = useRef();

    function handleInputChange( e ){
        const { id, value } = e.target; //

        setUserData( { ...userData, [id]: value } );
    }

    async function registerUser( e ){
        e.preventDefault();
        
        if( userData.email.trim() === "" ||
            !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)) ) {
            inputEmail.current.focus();
            dispatch( { do: 'setMessage', type: 'danger', message: 'Please provide a valid email' } );
            return;
        }

        if( userData.password.trim() === "" ) {
            inputPassword.current.focus();
            dispatch( { do: 'setMessage', type: 'danger', message: 'Please provide a password' } );
            return;
        }

        if( userData.password.trim().length < 8 ) {
            inputPassword.current.focus();
            dispatch( { do: 'setMessage', type: 'danger', message: 'Please provide a longer password (8 characters min)!' } );
            return;
        }

        const apiResult = await API.post('/api/user/register', userData);
                  
        if( apiResult.error ){
            dispatch( { do: 'setMessage', type: 'danger', message: apiResult.error } );
            return;
        }

        // remember the email
        localStorage.email = apiResult.rememberMe ? apiResult.email : '';

        dispatch( { do: 'setMessage', type: 'success', message: 'Thank you successfully registered' } );

        // let the message sit for a bit then redirect to login
        setTimeout( function(){ setIsRegistered(true); }, 5000 );
    }

    return (
        <div>
            { isRegistered ? <Redirect to='/login' /> : '' }

            <div class="container">
                <h1>User Registration</h1>
                <div class="card">
                    <div class="card-header">
                    Register
                    </div>
                    <div class="card-body">
                    <form role="form">
                        <input type='hidden' id='db_id' value='' />
                        <div class="form-group">
                            <label for="name">First Name</label>
                            <input value={userData.name} onChange={handleInputChange} id='name' type="text" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input 
                                value={userData.email} 
                                onChange={handleInputChange} 
                                ref={inputEmail}
                                id="email" type="email" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="userPassword">Password</label>
                            <input 
                                value={userData.password} 
                                onChange={handleInputChange} 
                                ref={inputPassword}
                                id="password" type="password" class="form-control" />
                        </div>
                        <button onClick={registerUser} class="btn btn-primary submit" >Register</button>
                        &nbsp; &nbsp; <a href="/login" class='font-weight-light text-muted'>Already Registered?</a>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;