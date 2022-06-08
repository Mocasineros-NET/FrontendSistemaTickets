import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { ticketsAtom } from "../_state";
import { useUserActions } from '_actions';

export { List };

function List({ match }) {
  const { path } = match;
  const role = JSON.parse(localStorage.getItem('user')).role;
  const tickets = useRecoilValue(ticketsAtom);
  const userActions = useUserActions();
  const [ticketInfo, setTicketInfo] = useState([]);

  useEffect(() => {
    userActions.getAllTicketsByRole(role);

    return userActions.resetTickets;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1>Tickets</h1>
      <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Ticket</Link>
      <table className="table table-striped">
        <thead>
        <tr className="text-white">
          <th style={{ width: '30%' }}>User</th>
          <th style={{ width: '30%' }}>Title</th>
          <th style={{ width: '30%' }}>Estado</th>
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
              <Link to={{
                pathname: `${path}/${ticket.id}`,
                state: {
                  title: ticket.title,
                  description: ticket.description,
                  date: ticket.createdAt.substr(0, 10),
                  comments: ticket.comments
                },
              }} className="btn btn-sm btn-primary mr-1 bg-green-400 text-black border-none hover:bg-green-500">View</Link>
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
