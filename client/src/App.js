import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import NavBar from './components/NavBar';
import ProductListPage from './components/ProductListPage';
import ProductInfoPage from './components/ProductInfoPage';
import SettingsPage from './components/SettingsPage';
import Footer from './components/Footer';

/* Our EVEREST App 

* added 'id' to product.json file (any different 3 ids)
* added <Link> to the ProductCard

Today's Mission:
- Finish building out the UI
- Wire-up the logic for it
- Build the backend (Mongo + Node + Express)
- Asking questions that relate to Google Book Search (as our app will be
  quite similar)

- *** Start at 10:10am ***

- Monday's Mission: Adding oAuth login for our user

*/
function App() {
  return (
    <Router>
    <div className="App">
        <NavBar />
        <div class="container">
          <Route exact path={["/","/productlist"]} component={ProductListPage} />
          <Route path="/productinfo/:id" component={ProductInfoPage} />
          <Route exact path="/settings" component={SettingsPage} />
        </div>

        <Footer />
    </div>
    </Router>
  );
}

export default App;
