import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useGlobalStore } from "./GlobalStore";
import { Redirect } from 'react-router-dom';

let showTimeout;

/* activePage  | changePage-call-back */
function NavBar() {
  const [showMenu, setShowMenu] = useState(false);
  const [ session ] = useState( localStorage.session );
  const [ globalData ] = useGlobalStore();

  const location = useLocation();
  const style = {
      logo: { width: '64px', height: '64px' }
  }

  if( showMenu ){
    // hide the nav after 10s
    clearTimeout( showTimeout );
    showTimeout = setTimeout( function(){ setShowMenu( false ); }, 5000 );
  }

  // force redirection if no session & yet not login/reg pages
  const invalidSession = !(session && session.length===36) && !(location.pathname==='/login' || location.pathname==='/register');

  const cartTotalQuantity = globalData.cart.reduce( (total,item) => total+item.num, 0 );

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
    </>
  );
}

export default NavBar;