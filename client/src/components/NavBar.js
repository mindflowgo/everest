import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useGlobalStore } from "./GlobalStore";
import { Redirect } from 'react-router-dom';
import API from "./API";

let showTimeout,serverInterval;
let prevLocation;

/* activePage  | changePage-call-back */
function NavBar() {
  const [ showMenu, setShowMenu ] = useState( false );
  const [ invalidSession, setInvalidSession ] = useState( false );
  const [ globalData, dispatch ] = useGlobalStore();

  const location = useLocation();
  const style = {
      logo: { width: '64px', height: '64px' }
  }

  function checkSession(){
    // force redirection if no session & yet not login/reg pages
    const isSessionExisting = localStorage.session && localStorage.session.length===36;
    const isUrlNotRequiringLogin = location.pathname==='/login' || location.pathname==='/register';
    console.log( `[Navbar] isSessionExisting(${isSessionExisting}) isUrlNotRequiringLogin(${isUrlNotRequiringLogin}): ${!isSessionExisting && !isUrlNotRequiringLogin}` );
    setInvalidSession( !isSessionExisting && !isUrlNotRequiringLogin );
  }

  async function checkServer(){
    try {
      const apiServerStatus = await API.get(`/server-status`)
      if( apiServerStatus.status==='running' ){
        // if server status was not good before, then we probably have a message of this
        // so clear it.
        if( globalData.serverStatus !== 'running')
          dispatch( { do: 'clearMessage' } );

      } else {
        dispatch( { do: 'setMessage', type: 'danger', message: apiServerStatus.error } );
        console.log( `[App] Crap server is not running, show an error...` );
      }
    } catch( e ){
      dispatch( { do: 'setMessage', type: 'danger', message: `Server down...` } );
    }
  }


  useEffect( function(){
    checkSession();

    // and do a periodic check on the server, indicating a problem if server is down
    setInterval( checkServer, 15000 );
    checkServer();
  }, [] );

  if( showMenu ){
    // hide the nav after 10s
    clearTimeout( showTimeout );
    showTimeout = setTimeout( function(){ setShowMenu( false ); }, 2000 );
  }

  // if we change locations, hide menu immediately
  if( prevLocation!==location.pathname ){
    console.log( `**** > location changed, hiding menu`)
    clearTimeout( showTimeout );
    showTimeout = setTimeout( function(){ setShowMenu( false ); }, 100 );
    // setShowMenu( false );
    prevLocation = location.pathname;
  }

  const cartTotalQuantity =( globalData && globalData.cart ? globalData.cart.reduce( (total,item) => total+item.num, 0 ) : 0 );

  return ( 
    <>
    { invalidSession ? <Redirect to='/login' /> : '' }
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <Link to="/" className="navbar-brand">
          <img src='https://upload.wikimedia.org/wikipedia/commons/7/79/Mountain_icon_%28Noun_Project%29.svg' alt="" style={style.logo} />
      </Link>
      {/* <a class="navbar-brand" href="#" onClick={ function(){ props.changePage('AboutPage')} }>Pupster</a> */}
      <button onClick={() => setShowMenu(!showMenu)} class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse `+(showMenu ? 'show' : '')} id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/productlist" className={location.pathname === "/productlist" ? "nav-link active" : "nav-link"}>
              Product List
            </Link>
          </li>          
          <li className="nav-item">
            <Link to="/productadd" className={location.pathname === "/productadd" ? "nav-link active" : "nav-link"}>
              Product Add
            </Link>
          </li> 
          <li className="nav-item">
            <Link to="/settings" className={location.pathname === "/settings" ? "nav-link active" : "nav-link"}>
              Settings
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className={location.pathname === "/cart" ? "nav-link active" : "nav-link"}>
              { cartTotalQuantity 
                ? <span class="badge badge-pill badge-success"><i class="fas fa-shopping-cart"></i> {cartTotalQuantity}</span>
                : ''
              }
            </Link>
          </li>          
          { localStorage.session ? 
            <li className="nav-item">
              <Link to="/logout" className="nav-link">
                Logout
              </Link>
            </li> 
            :
            <li className="nav-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
          }       
        </ul>
      </div>
    </nav>

    <div class='container'>
      {/* show user session info */}
      <div class='d-block'>{ globalData.thumbnail ? <img src={globalData.thumbnail} id='navThumbnail' /> : '' } Welcome {globalData.name}</div>
      {/* show a global message bar below the nav */}
      <div className={ globalData.messageType ? `alert alert-${globalData.messageType}` : 'd-hide' } role="alert">
          {globalData.message}
      </div>
    </div>      
    </>
  );
}

export default NavBar;