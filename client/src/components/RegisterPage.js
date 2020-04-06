import React, { useState, useRef } from "react";
import { Redirect } from 'react-router-dom';

function RegisterPage(){
    // DECLARATIVE FORM OF PROGRAMMING
    const [ userData, setUserData ] = useState({ name: "", email: "", password: ""});
    const [ isRegistered, setIsRegistered ] = useState( false );
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );

    const inputEmail = useRef();
    const inputPassword = useRef();

    function handleInputChange( e ){
        const { id, value } = e.target; //

        setUserData( { ...userData, [id]: value } );
    }

    async function registerUser( e ){
        e.preventDefault();
        
        if( userData.email === "" ) {
            inputEmail.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide your Email!' } );
            return;
        }
    
        if( !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)) ) {
            inputEmail.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide a valid Email!' } );
            return;
        }

        if( userData.password === "" ) {
            inputPassword.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide a password!' } );
            return;
        }

        if( userData.password.length < 8 ) {
            inputPassword.focus();
            setAlertMessage( { type: 'danger', message: 'Please provide a longer password (8 characters min)!' } );
            return;
        }

        const apiResult = await fetch('/api/user/registration', 
            {   method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
          }).then( result=>result.json())
                  
        if( apiResult.message ){
            setAlertMessage( { type: 'success', message: 'Thank you successfully registered!' } );
            
            setTimeout( function(){ setIsRegistered(true); }, 5000 );
        } else {
            setAlertMessage( { type: 'danger', message: apiResult.error } );
        }
    }

    return (
        <div>
            { isRegistered ? <Redirect to='/login' /> : '' }

            <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert">
                {alertMessage.message}
            </div>
            <section class="jumbotron text-center">
            <div class="container">
                <h1>User Registration</h1>
                <p class="lead text-muted">Register and go shopping!</p>
            </div>
            </section>
        
            <div class="container">
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
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;