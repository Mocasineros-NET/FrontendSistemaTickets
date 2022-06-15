import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { usersAtom } from "../_state";
import { useAlertActions, useUserActions } from "../_actions";

export { List };

function List({ history, match }) {
  const { path } = match;
  const users = useRecoilValue(usersAtom);
  const alertActions = useAlertActions();
  const userActions = useUserActions();
  const role = JSON.parse(localStorage.getItem('user')).role;

  useEffect(() => {
    userActions.getAll();

    return userActions.resetUsers;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickSetRole = (userId, roleId) => {
    const data = {
      roleId: roleId
    }
    return userActions.setUserRole(userId, data)
      .then(() => {
        alertActions.success('Role changed!')
      }).then(() => history.go(0));
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-3">🙎‍♂️Users</h1>
      <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add User</Link>
      <table className="table table-striped w-full">
        <thead>
        <tr>
          <th style={{ width: '30%' }}>Username</th>
          <th style={{ width: '30%' }}>Name</th>
          <th style={{ width: '30%' }}>Role</th>
          <th style={{width: '10%'}}/>
        </tr>
        </thead>
        <tbody>
        {users?.map(user =>
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.role === 0 && "Admin"}{user.role === 1 && "Manager"}{user.role === 2 && "Engineer"}{user.role === 3 && "User"}</td>
            <td style={{ whiteSpace: 'nowrap' }}>
              {(role === 0 || role === 1) && <div className="dropdown">
                <label tabIndex="0" className="btn btn-sm m-1">Change role</label>
                <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li><a onClick={() => onClickSetRole(user.id, 1)}>Manager</a></li>
                  <li><a onClick={() => onClickSetRole(user.id, 2)}>Engineer</a></li>
                  <li><a onClick={() => onClickSetRole(user.id, 3)}>User</a></li>
                </ul>
              </div>}
              <Link to={`${path}/edit/${user.id}`} className="btn btn-sm btn-primary mr-1">Edit</Link>
              <button onClick={() => userActions.deleteUser(user.id)} className="btn btn-sm bg-red-500" style={{ width: '60px' }} disabled={user.isDeleting}>
                {user.isDeleting
                  ? <span className="spinner-border spinner-border-sm"/>
                  : <span>Delete</span>
                }
              </button>
            </td>
          </tr>
        )}
        {!users &&
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
