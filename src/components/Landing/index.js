import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import './index.css';
const LandingPage = () =>
  <div className="container">
    <h3>Gestión de turnos de Mediación</h3>
    <Link className="link" to={ROUTES.SIGN_IN}>Iniciar Sesión</Link><span> para acceder a turnos</span>
  </div>

export default LandingPage;
