import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { ticketsAtom, usersAtom } from "../_state";
import { useAlertActions, useUserActions } from "../_actions";

export { List };

function List({ history, match }) {
  const { path } = match;
  const role = JSON.parse(localStorage.getItem('user')).role;
  const alertActions = useAlertActions();
  const tickets = useRecoilValue(ticketsAtom);
  const users = useRecoilValue(usersAtom);
  const userActions = useUserActions();

  useEffect(() => {
    userActions.getAllTicketsByRole(role);
    // admin and manager
    if (role === 0 || role === 1) {
      userActions.getAllEngineers();
    }

    return userActions.resetTickets && userActions.resetUsers;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickAssign = (ticketId, engineerId) => {
    const data = {
      engineerId: engineerId
    }
    return userActions.assignTicket(ticketId, data)
      .then(() => {
        alertActions.success('Ticked assigned')
      }).then(() => history.go(0));
  };

  const onClickUnAssign = (ticketId) => {
    return userActions.unAssignTicket(ticketId)
      .then(() => {
        alertActions.success('Ticked Unassigned')
      }).then(() => history.go(0));
  };

  return (
    <div>
      <h1>Tickets</h1>
      {role !== 2 && <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Ticket</Link>}
      <table className="table w-full text-black">
        <thead>
        <tr>
          <th style={{ width: '25%' }}>User</th>
          <th style={{ width: '25%' }}>Title</th>
          <th style={{ width: '25%' }}>Status</th>
          <th style={{ width: '15%' }}>Priority</th>
          <th style={{width: '10%'}}/>
        </tr>
        </thead>
        <tbody>
        {tickets?.map(ticket =>
          <tr key={ticket.id}>
            <td>{ticket.user.username}</td>
            <td>{ticket.title}</td>
            <td>{ticket.isClosed ? "Closed" : 'Open'}</td>
            <td>{ticket.priority === 0 && "Urgent"}{ticket.priority === 1 && "High"}{ticket.priority === 2 && "Moderate"}{ticket.priority === 3 && "Low"}{ticket.priority === 4 && "Very low"}</td>
            <td className="flex items-center" style={{ whiteSpace: 'nowrap' }}>
              <Link to={{pathname: `${path}/${ticket.id}`}} className="btn btn-sm btn-primary mr-1 text-black border-none hover:bg-secondary">View</Link>
              {(role === 0 || role === 1) && <div className="dropdown">
                {ticket.engineerId === null &&
                  <>
                    <label tabIndex="0" className="btn btn-sm m-1">Assign</label>
                    <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                      {users?.map(user => <li key={user.id}>
                        <a onClick={() => onClickAssign(ticket.id, user.id)}>{user.firstName+' '+user.lastName}</a>
                      </li>)}
                    </ul>
                  </>
                }
                {ticket.engineerId !== null &&
                  <>
                    <button onClick={() => onClickUnAssign(ticket.id)} tabIndex="0" className="btn btn-sm m-1 bg-yellow-600 text-white">Unassign</button>
                  </>
                }
              </div>}
              {role !== 2 && <Link to={`${path}/edit/${ticket.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>}
              {role !== 2 && <button onClick={() => userActions.deleteTicket(ticket.id)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={ticket.isDeleting}>
                {ticket.isDeleting
                  ? <span className="spinner-border spinner-border-sm"/>
                  : <span>Delete</span>
                }
              </button>}
            </td>
          </tr>
        )}
        {!tickets &&
          <tr>
            <td colSpan="4" className="text-center">
              <span className="spinner-border spinner-border-lg align-center"/>
            </td>
          </tr>
        }
        </tbody>
      </table>
    </div>
  );
}
