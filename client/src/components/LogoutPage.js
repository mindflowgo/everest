import React, { useEffect } from "react";
import { Redirect } from 'react-router-dom';
import API from "./API";
import { useGlobalStore } from "./GlobalStore";

function LogoutPage(){
    const [ globalData, dispatch ] = useGlobalStore();

    useEffect( function(){
        // attempt to request logout (only once)
        logoutRequest();
        }, [] );


    // call the api to logout (and clear session)
    async function logoutRequest(){
        console.log( `[logoutRequest] attempting to logout...` );
        const apiResult = await API.post( '/api/user/logout', {} );
                    
        console.log( `apiResult: `, apiResult );

        // quit if error
        if( apiResult.error ){
            dispatch( { do: 'setMessage', type: 'danger', message: apiResult.error } );
            return;
        }

        dispatch( { do: 'setMessage', type: 'success', message: 'Logged out...' } );

        // save the active session
        localStorage.session = '';

        setTimeout( function(){ 
                dispatch( { do: 'loginState', loggedIn: false })
            }, 3000 );
    }
    

    return (
        <div>
            { globalData.loggedIn ? '' : <Redirect to='/login' /> }

\            <section class="jumbotron text-center">
            <div class="container">
                <p class="lead text-muted">Please wait, logging out...</p>
            </div>
            </section>
        </div>
    )
}

export default LogoutPage;