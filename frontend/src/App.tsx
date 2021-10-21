import React from 'react';
import logo from './logo.svg';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { Dashboard } from './pages/admin/dashboard';
import { CreateAnk } from './pages/admin/createank';

function App() {
  return (
    <div id="approot">
      <Router>
        <Switch>
          <Route path="/adm/jsadm" component={Dashboard} />
          <Route path="/adm/createank" component={CreateAnk} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
