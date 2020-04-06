import React from 'react';
import { Link, useLocation } from "react-router-dom";

/* activePage  | changePage-call-back */
function NavBar() {
  const location = useLocation();
  const style = {
      logo: { width: '64px', height: '64px' }
  }

  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <Link to="/" className="navbar-brand">
          <img src='https://upload.wikimedia.org/wikipedia/commons/7/79/Mountain_icon_%28Noun_Project%29.svg' alt="" style={style.logo} />
      </Link>
      {/* <a class="navbar-brand" href="#" onClick={ function(){ props.changePage('AboutPage')} }>Pupster</a> */}
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/productlist" className={location.pathname === "/productlist" ? "nav-link active" : "nav-link"}>
              Product List
            </Link>
          </li>          
          <li className="nav-item">
            <Link to="/productinfo" className={location.pathname === "/productinfo" ? "nav-link active" : "nav-link"}>
              Product Info
            </Link>
          </li> 
          <li className="nav-item">
            <Link to="/settings" className={location.pathname === "/settings" ? "nav-link active" : "nav-link"}>
              Settings
            </Link>
          </li>                   
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;