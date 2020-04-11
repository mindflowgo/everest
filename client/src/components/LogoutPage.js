import React, { useState, useRef, useEffect } from "react";
import { Redirect } from 'react-router-dom';
import API from "./API";

function LogoutPage(){
    const [ isLoggedOut, setIsLoggedOut ] = useState( false );
    const [ alertMessage, setAlertMessage ] = useState( { type: "", message: ""} );

    useEffect( function(){
        // attempt to request logout (only once)
        logoutRequest();
        }, [] );

    // call the api to logout (and clear session)
    async function logoutRequest(){
        console.log( `[logoutRequest] attempting to logout...` );
        const apiResult = await API.post( '/api/user/logout', {} );
                    
        console.log( `apiResult: `, apiResult );

        if( apiResult.error ){
            setAlertMessage( { type: 'danger', message: apiResult.error } );
            return;
        };

        setAlertMessage( { type: 'success', message: 'Logged out...' } );

        // save the active session
        localStorage.session = '';

        setTimeout( function(){ setIsLoggedOut(true); }, 3000 );
    }
    

    return (
        <div>
            { isLoggedOut ? <Redirect to='/login' /> : '' }

            <div className={ alertMessage.type ? `alert alert-${alertMessage.type}` : 'd-hide' } role="alert">
                {alertMessage.message}
            </div>
            <section class="jumbotron text-center">
            <div class="container">
                <p class="lead text-muted">Please wait, logging out...</p>
            </div>
            </section>
        </div>
    )
}

export default LogoutPage;