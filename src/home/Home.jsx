import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { authAtom } from '_state';

export { Home };

function Home() {
    const auth = useRecoilValue(authAtom);

    return (
        <div className="p-4">
            <div className="container">
                <h1>Hi {auth?.firstName}!</h1>
                <p>Gracias por usar la API de Mocasineros!</p>
                <p><Link to="/users">Manage Users</Link></p>
            </div>
        </div>
    );
}
