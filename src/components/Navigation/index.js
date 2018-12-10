import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import './index.css';
// import { Alert, Navbar, Nav, NavDropdown, Form, Button, FormControl } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';
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
        {/* <Link className="navbar-item nav-link" to={ROUTES.LANDING}>Landing</Link> */}
        <Link className="navbar-item nav-link" to={ROUTES.GUEST}>Nuevo Turno</Link>
        <Link className="navbar-item nav-link" to={ROUTES.ACCOUNT}>Mi Cuenta</Link>
        {authUser.roles.includes(ROLES.ADMIN) && (
          <Link className="navbar-item nav-link" to={ROUTES.ADMIN}>Admin</Link>
        )}
      </div>
      <div className="navbar-nav">
        <SignOutButton />
      </div>
    </div>
  </nav>
  // <Navbar bg="dark" variant="dark">
  //   <Navbar.Brand href="/">PZ</Navbar.Brand>
  //   <Nav className="mr-auto">
  //     <LinkContainer to={ROUTES.GUEST}>
  //       <Nav.Link>Nuevo Turno</Nav.Link>
  //     </LinkContainer> 
  //     <LinkContainer to={ROUTES.GUEST}>
  //       <Nav.Link>Mis Turnos</Nav.Link>
  //     </LinkContainer> 
  //     <LinkContainer to={ROUTES.GUEST}>
  //       <Nav.Link className="right">Salir</Nav.Link>
  //     </LinkContainer> 
  //   </Nav>
  // </Navbar>
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
        <Link className="navbar-item nav-link" data-toggle="collapse" to={ROUTES.LANDING}>Home</Link>
      </div>
      <div className="navbar-nav">
        <Link className="navbar-item nav-link" data-toggle="collapse" to={ROUTES.SIGN_IN}>Iniciar Sesión</Link>
      </div>
    </div>
  </nav> 
  // <Navbar bg="dark" variant="dark">
  //   <Navbar.Brand href="/">PZ</Navbar.Brand>
  // </Navbar>
);

export default Navigation;
