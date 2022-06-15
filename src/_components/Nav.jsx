import { Link } from 'react-router-dom';
import Logo from '../_assets/logo.png';
import { useRecoilValue } from 'recoil';

import { authAtom } from "../_state";
import { useUserActions} from "../_actions";

export { Nav };

function Nav() {
  const auth = useRecoilValue(authAtom);
  const userActions = useUserActions();
  let role = null;
  if (JSON.parse(localStorage.getItem('user'))) {
    role = JSON.parse(localStorage.getItem('user')).role;
  }
  //const role = JSON.parse(localStorage.getItem('user')).role;

  // only show nav when logged in
  if (!auth) return null;

  return (
    <div className="navbar bg-neutral">
      <div className="flex-1">
        <Link to={{pathname: '/'}} className="hover:no-underline hover:text-white hover:bg-primary btn btn-ghost normal-case text-xl text-white">
          <img src={Logo} alt="logo" className="h-8 mr-2" />
          MocasinerosTickets
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0 text-white">
          <li>
            <Link to={{pathname: '/'}} className="hover:no-underline hover:text-white hover:bg-primary">
              Home
            </Link>
          </li>
          <li>
            <Link to={{pathname: '/Tickets'}} className="hover:no-underline hover:text-white hover:bg-primary">
              Tickets
            </Link>
          </li>
          {(role !== null && role !== 3) && <li>
            <Link to={{pathname: '/Articles'}} className="hover:no-underline hover:text-white hover:bg-primary">
              Articles
            </Link>
          </li>}
          {(role !== null && role === 0) && <li>
            <Link to={{pathname: '/Users'}} className="hover:no-underline hover:text-white hover:bg-primary">
              Users
            </Link>
          </li>}
          <li>
            <Link to={{pathname: '/'}} onClick={userActions.logout} className="hover:no-underline hover:text-white hover:bg-primary">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
