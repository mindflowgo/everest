import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from "react-router-dom";
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
      <NavLink to="/" className="navbar-brand">
          <img src='https://upload.wikimedia.org/wikipedia/commons/7/79/Mountain_icon_%28Noun_Project%29.svg' alt="" style={style.logo} />
      </NavLink>
      {/* <a class="navbar-brand" href="#" onClick={ function(){ props.changePage('AboutPage')} }>Pupster</a> */}
      <button onClick={() => setShowMenu(!showMenu)} class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse `+(showMenu ? 'show' : '')} id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li className="nav-item">
            <NavLink to="/productlist" className="nav-link" activeClassName="active">Product List</NavLink>
          </li>          
          <li className="nav-item">
            <NavLink to="/productadd" className="nav-link" activeClassName="active">Product Add</NavLink>
          </li> 
          <li className="nav-item">
            <NavLink to="/settings" className="nav-link" activeClassName="active">Settings</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/cart" className="nav-link" activeClassName="active">
              { cartTotalQuantity 
                ? <span class="badge badge-pill badge-success"><i class="fas fa-shopping-cart"></i> {cartTotalQuantity}</span>
                : ''
              }
            </NavLink>
          </li>          
          { localStorage.session ? 
            <li className="nav-item">
              <NavLink to="/logout" className="nav-link">Logout</NavLink>
            </li> 
            :
            <li className="nav-item">
              <NavLink to="/login" className="nav-link">Login</NavLink>
            </li>
          }       
        </ul>
      </div>
    </nav>

    <div class='container'>
      {/* show user session info */}
      { globalData.name ? <div class='d-block'>{ globalData && globalData.thumbnail ? <img src={globalData.thumbnail} id='navThumbnail' /> : '' } Welcome {globalData.name}</div> : '' }
      {/* show a global message bar below the nav */}
      <div className={ globalData.messageType ? `alert alert-${globalData.messageType}` : 'd-hide' } role="alert">
          {globalData.message}
      </div>
    </div>      
    </>
  );
}

export default NavBar;