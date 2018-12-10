import React, { Component } from 'react';
import { compose } from 'recompose';

import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import Calendar from 'react-calendar';
import './index.css';
import { Button, ButtonToolbar, Table, Modal, Alert } from 'react-bootstrap';
import Moment from 'react-moment';
import 'moment-timezone';
// import { app } from 'firebase';
import * as MEDIATOR from '../../constants/data';
import { any } from 'prop-types';


class HomePage extends Component {
  constructor() {
    super();

    this.state = {
      userLoading: false,
      messageLoading: false,
      text: '',
      messages: [],
      users: {},
      date: new Date(),
      showList: false,
      showCalendar: true,
      showConfirmationModal: false,
      showConfirmationError: false,
      confirmationResult: any,
      title: 'Nuevo Turno',
      appts: [
        { id: 1, startTime: new Date(), endTime: new Date(), date: new Date() },
        { id: 2, startTime: new Date(), endTime: new Date(), date: new Date() }
      ],
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

  onChangeSelectedDate = selectedDate => {
    this.setState({ date: new Date(selectedDate) });
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

  showList = () => {
    this.setState(
      {
        showList: true,
        showCalendar: false,
        showConfirmationModal: false,
      });
  }

  getCalendar = () => {
    this.setState(
      {
        showList: false,
        showCalendar: true,
        showConfirmationModal: false,
      });
  }

  onSelectAppt = () => {
    this.setState(
      {
        showList: true,
        showCalendar: false,
        showConfirmationModal: false,
      });
  }

  onConfirmAppt = (appt) => {
    this.setState(
      {
        appt: appt,
        showList: false,
        showCalendar: false,
        showConfirmationModal: true,
      });
  }

  confirmAppt = () => {
    let title = "Turno Confirmado";
    //request appt and show success/error component here
    this.setState(
      {
        showList: false,
        showCalendar: false,
        showConfirmationModal: false,
        showConfirmationMessage: true,
        title: title,
      }
    );
  }

  closeModal = () => {
    this.setState(
      {
        showList: true,
        showCalendar: false,
        showConfirmationModal: false,
      }
    );
  }

  render() {
    const {
      messages,
      users,
      // text,
      userLoading,
      messageLoading,
      appts,
      appt,
      date,
    } = this.state;
    const loading = userLoading || messageLoading;

    return (
      <AuthUserContext.Consumer>
        {() => (<div className="container">
          <h3>{this.state.title}</h3>
          <p>
            Fecha solicitada de turno:
            <Moment format="DD/MM/YYYY" className="date-format">
              {date}
            </Moment>
          </p>
          <ButtonToolbar>
            {this.state.showCalendar ? <Button variant="dark"
              className="button-container"
              onClick={this.showList}>Ver turnos</Button> : null}
            {this.state.showList ? <Button variant="dark"
              className="button-container"
              onClick={this.getCalendar}>Ver Calendario</Button> : null}
          </ButtonToolbar>
          {this.state.showCalendar ? <Calendar variant='dark' onChange={this.onChangeSelectedDate} value={date} /> : null}
          {this.state.showList ? <ApptsList appts={appts} onConfirmAppt={this.onConfirmAppt} /> : null}
          {this.state.showConfirmationModal ? <ConfirmationModal appt={appt} close={this.closeModal} confirm={this.confirmAppt} /> : null}
          {this.state.showConfirmationMessage ? <ConfirmationSuccess appt={appt} /> : null}
          {this.state.showErrorMessage ? <ConfirmationError appt={appt} /> : null}
          {!loading && (<MessageList messages={messages} users={users} />)}
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

const ApptsList = ({ appts, onConfirmAppt }) => (
  <Table striped bordered hover responsive='sm'>
    <thead>
      <tr>
        <th>Hora Inicio</th>
        <th>Hora Fin</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {appts.map(appt => (
        <tr key={appt.id}>
          <td>
            <Moment format="hh:mm:ss">
              {appt.startTime}
            </Moment>
          </td>
          <td>
            <Moment format="hh:mm:ss">
              {appt.endTime}
            </Moment>
          </td>
          <td align="center">
            <Button variant="dark" onClick={() => onConfirmAppt(appt)}>
              Agendar
        </Button>
          </td>
        </tr>
      ))}
      <tr>
      </tr>
    </tbody>
  </Table>
);

const ConfirmationSuccess = (appt) => (
  <Alert variant="dark">
    <p>
      El turno fue agendado exitosamente. Haz click <a href="/">aqui</a> para cancelaciones o modificaciones
      </p>
    <p>
      Descargue y complete el siguiente documento haciendo en el siguiente <a href={MEDIATOR.M2_DOC_URL} target='_blank'>enlace</a>.
    </p>
    <p>
      <b>Esta documentación es obligatoria y deberá presentarla el día de la mediación</b>
    </p>
  <h4>
    Información de turno
  </h4>
    <div>Fecha:
        <Moment className="date-format" format="DD/MM/YYYY">
        {appt.date}
      </Moment>
    </div>
    <div>Hora Inicio:
         <Moment className="date-format" format="hh:mm:ss">
        {appt.startTime}
      </Moment>
    </div>
    <div>Hora Fin:
         <Moment className="date-format" format="hh:mm:ss">
        {appt.startTime}
      </Moment>
    </div>
    <div>
      Dirección: <b >{MEDIATOR.ADDRESS}</b>
    </div>
  </Alert>
)

const ConfirmationError = (appt) => (
  <Alert variant="danger">
    El turno no pudo ser finalizado exitosamente. Intenta en otra fecha/hora o comunicate por email a {MEDIATOR.MEDIATOR_EMAIL} o telefonicamente a {MEDIATOR.MEDIATOR_TELEPHONE}
  </Alert>
)

const ConfirmationModal = ({ appt, close, confirm }) => (
  <Modal.Dialog>
    <Modal.Header closeButton>
      <Modal.Title>Desea confirmar turno?</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Fecha:
        <Moment className="date-format" format="DD/MM/YYYY">
          {appt.date}
        </Moment>
      </p>
      <p>Hora Inicio:
         <Moment className="date-format" format="hh:mm:ss">
          {appt.startTime}
        </Moment>
      </p>
      <p>Hora Fin:
         <Moment className="date-format" format="hh:mm:ss">
          {appt.startTime}
        </Moment>
      </p>
      <p>
        Dirección: <b >{MEDIATOR.ADDRESS}</b>
      </p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="dark" onClick={confirm}>Confirmar</Button>
      <Button variant="default" onClick={close}>Cerrar</Button>
    </Modal.Footer>
  </Modal.Dialog>
);

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(HomePage);
