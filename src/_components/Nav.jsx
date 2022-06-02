import { Link } from 'react-router-dom';
import Logo from '../_assets/logo.png';
import { useRecoilValue } from 'recoil';

import { authAtom } from '_state';
import { useUserActions } from '_actions';

export { Nav };

function Nav() {
    const auth = useRecoilValue(authAtom);
    const userActions = useUserActions();

    // only show nav when logged in
    if (!auth) return null;
    
    return (
      <div className="navbar bg-slate-900">
          <div className="flex-1">
              <Link exact to={{pathname: '/'}} className="hover:no-underline hover:text-white hover:bg-slate-800">
                  <a className="btn btn-ghost normal-case text-xl text-white">
                      <img src={Logo} alt="logo" className="h-8 mr-2" />
                      MocasinerosTickets
                  </a>
              </Link>
          </div>
          <div className="flex-none">
              <ul className="menu menu-horizontal p-0 text-white">
                  <li>
                      <Link exact to={{pathname: '/'}} className="hover:no-underline hover:text-white hover:bg-slate-600">
                          Home
                      </Link>
                  </li>
                  <li>
                      <Link to={{pathname: '/tickets'}} className="hover:no-underline hover:text-white hover:bg-slate-600">
                          Tickets
                      </Link>
                  </li>
                  <li>
                      <Link to={{pathname: '/users'}} className="hover:no-underline hover:text-white hover:bg-slate-600">
                          Users
                      </Link>
                  </li>
              </ul>
          </div>
      </div>
    );
}
