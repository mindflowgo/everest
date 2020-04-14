import React, { useEffect } from 'react'
const API_URL = window.location.protocol+'//'+window.location.host.replace('localhost:3000','localhost:8080');

let oAuthWindow;
let oAuthPending = false;

function OAuth( props ){
    useEffect( function(){
        // listen for message from popup window
        window.addEventListener('message', function(e) {
            // only listen to JSON messages, ignore rest
            if( !(e && e.data && typeof(e.data)==='string' && e.data.substr(0,1)==='{' && e.data.substr(-1,1)==='}') ) 
                return;

            const loginData = JSON.parse(e.data);
            console.log(`<< from popup window, received:`, loginData);
            if( oAuthWindow ) oAuthWindow.close();
            // pass back the login info
            if( props.loginComplete ) props.loginComplete(loginData);
        } , false);
    }, [] );
     
    /* 
    >> everestapp.herokuapp.com/oauth/twitter -> [passport plugin] -> api.twitter.com/oauth/....
    << everestapp.herokuapp.com/oauth/twitter/callback with user-name + thumnbail + access-token
       JSON string with information that we can pass to the parent window
    */
    function openOAuth( client ) {
        if (oAuthPending) return;

        // get the popup window ready (center) and open!
        const width = 600, height = 600
        const left = (window.innerWidth / 2) - (width / 2)
        const top = (window.innerHeight / 2) - (height / 2)
        const url = `${API_URL}/oauth/${client}`
        console.log( `[openOAuth] opening url: ${url}`)
        oAuthWindow =  window.open(url, '',       
          `toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
          height=${height}, top=${top}, left=${left}` );

        oAuthPending = true;
        // monitor popup
        checkPopup()
    }

    function checkPopup() {
        const check = setInterval(() => {
          if (!oAuthWindow || oAuthWindow.closed || oAuthWindow.closed === undefined) {
            clearInterval(check)
            oAuthPending = false;
          }
        }, 1000)
    }
    const icons = {
        facebook: "fa-facebook-square",
        twitter: "fa-twitter-square",
        google: "fa-google-plus-square",
        github: "fa-github-square",
        linkedin: "fa-linkedin"
    }
    return (
        <div class="card">
            <div class="card-body d-flex justify-content-center">
                {props.providers.map( provider=>

                    <button onClick={()=>openOAuth(provider)} class='btn btn-outline-primary' style={{marginRight:'10px'}}>
                        <i className={`fab ${icons[provider]} fa-3x`}></i>
                    </button>
                )}
            </div>
        </div>
    )
}

export default OAuth;
