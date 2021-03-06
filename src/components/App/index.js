import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Guest';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import AppointmentPage from '../Appointments'
import { withAuthentication } from '../Session';
import * as ROUTES from '../../constants/routes';
import * as MEDIATOR from '../../constants/data';

import './index.css';

const App = () => (
  <Router>
    <div className="app">
      <Navigation />
      <hr />
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route
        exact
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route exact path={ROUTES.GUEST} component={HomePage} />
      <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route exact path={ROUTES.ADMIN} component={AdminPage} />
      <Route exact path={ROUTES.APPOINTMENTS} component={AppointmentPage} />
      <footer className="footer">
        <div className="container">
          <span className="text-muted footer-text">
            {MEDIATOR.FOOTER_DATA}
          </span>
        </div>
      </footer>

    </div>
  </Router>
);

export default withAuthentication(App);
