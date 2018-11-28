import React from 'react';
import './index.css';

import { withFirebase } from '../Firebase';
const SignOutButton = ({ firebase }) => (
  <button type="button" className="btn btn-link text-link" onClick={firebase.doSignOut}>
    Salir
  </button>
);

export default withFirebase(SignOutButton);
