import React, { useEffect } from 'react'
const API_URL = window.location.protocol+'//'+window.location.host.replace('localhost:3000','localhost:8080');

let oAuthWindow;
let oAuthPending = false;

function OAuth( props ){
    useEffect( function(){
        // listen for message from popup window
        window.addEventListener('message', function(e) {
            console.log(`received message: `, e.data);
            if( oAuthWindow ) oAuthWindow.close();
        } , false);
    }, [] );
     
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
    
    return (
        <div>
            {props.providers.map( provider=>

                <button onClick={()=>openOAuth(provider)} class='btn btn-outline-primary' style={{marginRight:'10px'}}>
                    <i className={`fab fa-${provider}${provider==='google'?'-plus':''}-square fa-3x`}></i>
                </button>
            )}
        </div>
    )
}

export default OAuth;
