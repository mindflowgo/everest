import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { StoreProvider } from './utils/GlobalStore'

import NavBar from './components/NavBar'
import Footer from './components/Footer/index'
import AlertBar from './components/AlertBar'
// pages
import Products from './pages/Products'
import ProductsInfo from './pages/ProductsInfo'
import ProductsAdd from './pages/ProductsAdd'
import Register from './pages/Register/index.js'
import Login from './pages/Login/index'
import Logout from './pages/Logout'
import Cart from './pages/Cart'
import Settings from './pages/Settings'
import Messages from './pages/Messages'
import UserCreation from './pages/UserCreation'

function App() {
   return (
      <StoreProvider>
         <BrowserRouter>
            <div className="container">
               <AlertBar />
               <NavBar />
               <Route exact path={['/', '/products']} component={Products} />
               <Route exact path={'/info'} component={UserCreation} />
               <Route exact path="/products/add" component={ProductsAdd} />
               <Route exact path="/products/info/:id" component={ProductsInfo} />
               <Route exact path="/cart" component={Cart} />
               <Route exact path="/settings" component={Settings} />
               <Route exact path="/register" component={Register} />
               <Route exact path="/login" component={Login} />
               <Route exact path="/logout" component={Logout} />
               <Route exact path="/messages" component={Messages} />
            </div>
         </BrowserRouter>
         <Footer/>
      </StoreProvider>
      
   )
}

export default App