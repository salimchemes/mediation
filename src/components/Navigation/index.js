import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import './index.css';

const Navigation = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <NavigationAuth authUser={authUser} />
      ) : (
          <NavigationNonAuth />
        )
    }
  </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <a className="navbar-brand" href="/">
      <span>Logo</span>
    </a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse justify-content-between" id="navbarNavAltMarkup">
      <div className="navbar-nav">
        <Link className="navbar-item nav-link" to={ROUTES.LANDING}>Landing</Link>
        <Link className="navbar-item nav-link" to={ROUTES.HOME}>Home</Link>
        <Link className="navbar-item nav-link" to={ROUTES.ACCOUNT}>Account</Link>
        {authUser.roles.includes(ROLES.ADMIN) && (
          <Link className="navbar-item nav-link" to={ROUTES.ADMIN}>Admin</Link>
        )}
      </div>
      <div className="navbar-nav">
        <SignOutButton />
      </div>
    </div>
  </nav>
);

const NavigationNonAuth = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <a className="navbar-brand" href="/">
      <span>Logo</span>
    </a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse justify-content-between" id="navbarNavAltMarkup">
      <div className="navbar-nav">
        <Link className="navbar-item nav-link" to={ROUTES.LANDING}>Home</Link>
      </div>
      <div className="navbar-nav">
        <Link className="navbar-item nav-link" to={ROUTES.SIGN_IN}>Iniciar Sesión</Link>
      </div>
    </div>
  </nav>
);

export default Navigation;
