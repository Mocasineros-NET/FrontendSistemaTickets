import { useRecoilValue } from 'recoil';

import { authAtom } from "../_state";
import {Link} from "react-router-dom";

export { Home };

function Home() {
    const auth = useRecoilValue(authAtom);
    const role = JSON.parse(localStorage.getItem('user')).role;

    return (
        <div className="p-14">
            <div className="container w-screen m-auto">
              <div className="card w-96 bg-base-100 shadow-xl m-auto">
                <div className="avatar px-10 pt-10 m-auto">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src="https://api.lorem.space/image/face?hash=3174" alt="profile picture"/>
                  </div>
                </div>
                <div className="card-body items-center text-center">
                  <h2 className="card-title">Welcome {auth?.firstName}! 👋🏻</h2>
                  <p className="mb-1">{role === 0 && "Admin"}{role === 1 && "Manager"}{role === 2 && "Engineer"}{role === 3 && "Client"}</p>
                  <div className="card-actions">
                    <Link to="/tickets" className="btn btn-primary">My tickets</Link>
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
}
