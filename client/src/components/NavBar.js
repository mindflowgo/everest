import React, { useState, useEffect } from 'react'
import { Redirect, NavLink, useLocation } from 'react-router-dom'
import { useStoreContext } from '../utils/GlobalStore'
import fetchJSON from '../utils/API'

let timeout

function NavBar() {
  const [{ authOk, name, thumbnail, cart }, dispatch ]= useStoreContext()
  const [ showMenu, setShowMenu ] = useState( false )
  const [ cartNum, setCartNum ]= useState( 0 )
  const location = useLocation()

  async function loadUserSession(){
    const { status, userData, message }= await fetchJSON( `/api/users/session` )
    console.log( `[NavBar] attempted to reload session, result(${status}) message(${message})` )
    if( !status ){
       // clear any session
       localStorage.session = ''
       dispatch({ type: 'ALERT_MESSAGE', message })
       return
    }
    dispatch({ type: 'USER_LOGIN', data: userData })
  }

  useEffect( function(){
    if( showMenu ){
        if( timeout ) {
          clearTimeout( timeout )
        }
        timeout = setTimeout( function(){
          setShowMenu( false );
        }, 2000 )
    }
  }, [ showMenu ])

  // location changed so hide menu
  useEffect( function(){
    if( timeout ) {
        clearTimeout( timeout )
    }
    setShowMenu( false )
  }, [ location ])

  useEffect( function(){
    // changes in the cart, then re-calculate the total
    console.log( `.. updating cart num: `, cart.reduce( (total,item) => total+item.num, 0 ) )
    setCartNum( cart.reduce( (total,item) => total+item.num, 0 ) )
  }, [ cart ])

  useEffect( function(){
    // on load let's get the session if it's blank (Ex browser reload)
    if( localStorage.session.length===36 && !authOk ){
      loadUserSession()
    }
  }, [] )

   return (
      <>
         { localStorage.session.length!==36 && !authOk ? <Redirect to='/login' /> :
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
               <NavLink to="/" className="navbar-brand">
                  <img src='https://upload.wikimedia.org/wikipedia/commons/7/79/Mountain_icon_%28Noun_Project%29.svg' alt="mountain icon" width="64" height="64" />
               </NavLink>
               <button onClick={() => setShowMenu(!showMenu)} class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar">
                  <span class="navbar-toggler-icon"></span>
               </button>

               <div className={'collapse navbar-collapse '+(showMenu ? 'show' : '')} id="navbar">
                  <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                     <li className="nav-item">
                        <NavLink to="/products" className="nav-link" activeClassName="active">Product List</NavLink>
                     </li>
                     <li className="nav-item">
                        <NavLink to="/products/add" className="nav-link" activeClassName="active">Product Add</NavLink>
                     </li>
                     <li className="nav-item">
                        <NavLink to="/settings" className="nav-link" activeClassName="active">Settings</NavLink>
                     </li>
                     <li className="nav-item">
                        <NavLink to="/cart" className="nav-link" activeClassName="active">
                          <i class="fas fa-shopping-cart"></i> Cart { cartNum>0 && <span class="badge rounded-pill bg-warning text-dark">{cartNum}</span> }
                        </NavLink>
                     </li>
                     <li className="nav-item">
                        <NavLink to="/logout" className="nav-link">Logout</NavLink>
                      </li> 
                  </ul>
                  { thumbnail && <div class="d-flex"><div class="mx-3"><img src={thumbnail} id='navThumbnail' alt="user thumbnail" width="64" height="64" /></div></div> }
                  { !thumbnail && name && <div class="d-flex"><div class="mx-3">Welcome back <u>{name}</u></div></div> }
               </div>
            </nav>
         }
      </>
   )
}

export default NavBar