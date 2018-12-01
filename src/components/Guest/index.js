import React, { Component } from 'react';
import { compose } from 'recompose';

import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Calendar from 'react-calendar';
import './index.css';
import { Button, ButtonToolbar } from 'react-bootstrap';
import Moment from 'react-moment';
import 'moment-timezone';

class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      userLoading: false,
      messageLoading: false,
      text: '',
      messages: [],
      users: {},
      date: new Date,
    };
  }

  componentDidMount() {
    this.setState({ userLoading: true, messageLoading: true });

    this.props.firebase.users().on('value', snapshot => {
      this.setState(state => ({
        users: snapshot.val(),
        userLoading: false,
      }));
    });

    this.props.firebase
      .messages()
      .orderByKey()
      .limitToLast(100)
      .on('child_added', snapshot => {
        this.setState(state => ({
          messages: [snapshot.val(), ...state.messages],
          messageLoading: false,
        }));
      });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
    this.props.firebase.messages().off();
  }

  onChange = selectedDate => {
    console.log(selectedDate);
    this.setState({ date: selectedDate });
  };

  onSubmit = (event, authUser) => {
    const { text } = this.state;

    this.props.firebase.messages().push({
      text,
      userId: authUser.uid,
    });

    this.setState({ text: '' });

    event.preventDefault();
  };


  render() {
    const {
      messages,
      users,
      text,
      userLoading,
      messageLoading,
    } = this.state;

    const loading = userLoading || messageLoading;

    return (
      <AuthUserContext.Consumer>
        {() => (<div className="container">
          <h3>Nuevo Turno</h3>
          <p>
            Fecha solicitada de turno:
            <Moment format="DD/MM/YYYY">
              {this.state.date}
            </Moment>
          </p>
          <Calendar onChange={this.onChange} value={this.state.date} />
          {!loading && (<MessageList messages={messages} users={users} />)}
          <ButtonToolbar>
            <Button variant="primary" className="button-container">Ver turnos</Button>
          </ButtonToolbar>
        </div>)}
      </AuthUserContext.Consumer>
    );
  }
}

const MessageList = ({ messages, users }) => (
  <ul>
    {messages.map((message, key) => (
      <MessageItem
        key={key}
        message={message}
        user={users[message.userId]}
      />
    ))}
  </ul>
);

const MessageItem = ({ message, user }) => (
  <li>
    <strong>{user.username}</strong>

    {message.text}
  </li>
);

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(HomePage);
