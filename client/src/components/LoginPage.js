import React, { useEffect, useRef } from "react";
import { Redirect } from 'react-router-dom';
import { useGlobalStore } from "./GlobalStore";
import API from "./API";
import OAuth from "./OAuth";

function LoginPage(){
    const [ globalData, dispatch ] = useGlobalStore();
    console.log( `[LoginPage] globalData:`, globalData )

    const inputEmail = useRef()
    const inputPassword = useRef()
    const inputRememberMe = useRef()

    // at startup we initialize a few things
    useEffect( function(){
        inputEmail.current.value = localStorage.email || ''
        inputRememberMe.current.checked = true
    }, [] )


    function loginComplete( loginData ){ 
        console.log( `[loginComplete] loginData:`, loginData )
        delete loginData.message
        // save the active session
        localStorage.session = loginData.session

        // notify user message; set user session/data
        dispatch( [
            { do: 'setMessage', type: 'success', message: loginData.message },
            { do: 'setUserData', data: loginData } 
            ] )

        setTimeout( function(){ 
            dispatch( [ 
                { do: 'clearMessage' }, 
                { do: 'loginState', loggedIn: true } 
                ] )
            }, 3000 )
    }

    async function loginUser( e ){
        console.log( `[loginUser]` )
        e.preventDefault()
        
        const userData = {
            email: inputEmail.current.value,
            password: inputPassword.current.value,
            rememberMe: inputRememberMe.current.checked
        }

        if( userData.email === "" ) {
            inputEmail.current.focus()
            dispatch( [{ do: 'setMessage', type: 'danger', message: 'Please enter your email!' }] )
            return
        }
    
        if( userData.password === "" || userData.password.length < 8 ) {
            inputPassword.current.focus()
            console.log( `.. calling dispatch for password box`)
            dispatch( [{ do: 'setMessage', type: 'danger', message: 'Please enter your password!' }] )
            return
        }

        const apiResult = await API.post( '/api/user/login', userData )
            
        if( apiResult.error ){
            // clear any session
            localStorage.session = ''

            dispatch( [{ do: 'setMessage', type: 'danger', message: apiResult.error }] )
            return
        }

        loginComplete( apiResult )
    }

    return (
        <div>
            { globalData.loggedIn ? <Redirect to='/productlist' /> : '' }

            <hr />
            <h1>Login</h1>
        
            <div class="container">
                <OAuth providers={['twitter','facebook','github','google','linkedin']} loginComplete={loginComplete} />
                <div class="card">
                    <div class="card-body">
                    <form>
                        <div class="form-group">
                            <label for="inputEmail">Email Address</label>
                            <input ref={inputEmail} id="email" type="email" class="form-control" />
                        </div>
                        <div class="form-group">
                            <label for="userPassword">Password</label>
                            <input ref={inputPassword} id="password" type="password" class="form-control" />
                        </div>
                        <button onClick={loginUser} type="button" class="btn btn-primary submit">Login</button>
                        &nbsp; 
                        <input ref={inputRememberMe} type="checkbox" />                        
                        <label class='text-secondary' for='rememberMe'>Remember Me</label> &nbsp;
                        <a href="/register">Need to Register?</a>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;