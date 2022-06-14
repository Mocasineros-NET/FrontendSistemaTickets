import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { ticketsAtom, usersAtom } from "../_state";
import { useAlertActions, useUserActions } from "../_actions";

export { List };

function List({ match }) {
  const { path } = match;
  const role = JSON.parse(localStorage.getItem('user')).role;
  const alertActions = useAlertActions();
  const tickets = useRecoilValue(ticketsAtom);
  const users = useRecoilValue(usersAtom);
  const userActions = useUserActions();

  useEffect(() => {
    userActions.getAllTicketsByRole(role);

    if (role === 0 || role === 1) {
      userActions.getAll();
    }

    return userActions.resetTickets && userActions.resetUsers;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = (ticketId, engineerId) => {
    const data = {
      engineerId: engineerId
    }
    return userActions.assignTicket(ticketId, data)
      .then(() => {
        alertActions.success('Ticked assigned')
      })
  };

  return (
    <div>
      <h1>Tickets</h1>
      <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Ticket</Link>
      <table className="table table-striped">
        <thead>
        <tr className="text-white">
          <th style={{ width: '30%' }}>User</th>
          <th style={{ width: '30%' }}>Title</th>
          <th style={{ width: '30%' }}>Status</th>
          <th style={{ width: '10%' }}></th>
        </tr>
        </thead>
        <tbody>
        {tickets?.map(ticket =>
          <tr className="text-white" key={ticket.id}>
            <td>{ticket.user.username}</td>
            <td>{ticket.title}</td>
            <td>{ticket.isClosed ? "Abierto" : 'Cerrado'}</td>
            <td style={{ whiteSpace: 'nowrap' }}>
              <Link to={{pathname: `${path}/${ticket.id}`}} className="btn btn-sm btn-primary mr-1 bg-green-400 text-black border-none hover:bg-green-500">View</Link>
              {role === 0 && <div className="dropdown">
                <label tabIndex="0" className="btn m-1">Assign</label>
                <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  {users?.map(user => <li key={user.id}><a onClick={() => onClick(ticket.id, user.id)}>{user.firstName+' '+user.lastName}</a></li>)}
                </ul>
              </div>}
              <Link to={`${path}/edit/${ticket.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
              <button onClick={() => userActions.deleteTicket(ticket.id)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={ticket.isDeleting}>
                {ticket.isDeleting
                  ? <span className="spinner-border spinner-border-sm"></span>
                  : <span>Delete</span>
                }
              </button>
            </td>
          </tr>
        )}
        {!tickets &&
          <tr>
            <td colSpan="4" className="text-center">
              <span className="spinner-border spinner-border-lg align-center"></span>
            </td>
          </tr>
        }
        </tbody>
      </table>
    </div>
  );
}
