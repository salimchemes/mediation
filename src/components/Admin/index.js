import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import { Table, Button } from 'react-bootstrap';
class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();
      const users = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState(state => ({
        users,
        loading: false,
      }));
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  onRemove = userId => {
    this.props.firebase.user(userId).remove();
  };

  addUser = () => {
    alert('nuevo user');
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div className='container'>
        <h3>Admin</h3>
        <p>
          Administración de usuarios
        </p>

        {loading && <div>Loading ...</div>}
        <p> 
          <Button variant='primary' onClick={this.addUser}> Nuevo Usuario
        </Button>
        </p>
        <UserList users={users} onRemove={this.onRemove} />
      </div>


    );
  }
}

const UserList = ({ users, onRemove }) => (
  <Table striped bordered hover responsive='sm'>
    <thead>
      <tr>
        <th>Usuario </th>
        <th>email</th>
        <th>Rol</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.uid}>
          <td>
            {user.username}
          </td>
          <td>
            {user.email}
          </td>
          <td>
            {(user.roles || ['GUEST']).join('')}
          </td>
          <td>
            <Button variant='danger' onClick={() => onRemove(user.uid)}>
              Eliminar
          </Button>
          </td>
        </tr>
      ))}
      <tr>
      </tr>
    </tbody>

  </Table>
);

const condition = authUser =>
  authUser && authUser.roles.includes(ROLES.ADMIN);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);
