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
import { CheckAnk } from './pages/admin/checkank';
import { LoginScreen } from './pages/admin/login';
import { Ans } from './ankit/AnsScreen';
import { NotifElm } from './components/tools/notifagation';
import { CheckAnkFT } from './pages/admin/checkank_ft';

function App() {
  return (
    <div id="approot">
      <NotifElm />
      <Router>
        <Switch>
          <Route path="/adm/jsadm" component={Dashboard} />
          <Route path="/adm/createank" component={CreateAnk} />
          <Route path="/adm/checkank/:ankid" component={CheckAnk} />
          <Route path="/adm/login" component={LoginScreen} />
          <Route path="/adm/checkankft/:ankid" component={CheckAnkFT} />
          <Route path="/ans/:ankid" component={Ans} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
