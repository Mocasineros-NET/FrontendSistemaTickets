import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';

import { history, useFetchWrapper } from '_helpers';
import {authAtom, usersAtom, userAtom, ticketsAtom, ticketAtom} from '_state';

export { useUserActions };

function useUserActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}`;
    const fetchWrapper = useFetchWrapper();
    const [auth, setAuth] = useRecoilState(authAtom);
    const setUsers = useSetRecoilState(usersAtom);
    const setUser = useSetRecoilState(userAtom);
    const setTickets = useSetRecoilState(ticketsAtom);
    const setTicket = useSetRecoilState(ticketAtom);

    return {
        login,
        logout,
        register,
        getAll,
        getAllTicketsByRole,
        getById,
        update,
        delete: _delete,
        resetUsers: useResetRecoilState(usersAtom),
        resetUser: useResetRecoilState(userAtom),
        resetTickets: useResetRecoilState(ticketsAtom),
        resetTicket: useResetRecoilState(ticketAtom)
    }

    function login({ username, password }) {
        return fetchWrapper.post(`${baseUrl}/users/authenticate`, { username, password })
            .then(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                setAuth(user);

                // get return url from location state or default to home page
                const { from } = history.location.state || { from: { pathname: '/' } };
                history.push(from);
            });
    }

    function logout() {
        // remove user from local storage, set auth state to null and redirect to login page
        localStorage.removeItem('user');
        setAuth(null);
        history.push('/account/login');
    }

    function register(user) {
        return fetchWrapper.post(`${baseUrl}/users/register`, user);
    }

    function getAll() {
        return fetchWrapper.get(`${baseUrl}/users`).then(setUsers);
    }

    function getAllTicketsByRole(role) {
        // admin
        if (role === 0) {
            return fetchWrapper.get(`${baseUrl}/api/tickets`).then(setTickets);
        }
        // manager
        if (role === 1) {
            return fetchWrapper.get(`api/${baseUrl}/Tickets`).then(setTickets);
        }
        // engineer
        if (role === 2) {
            return fetchWrapper.get(`api/${baseUrl}/GetMyAssignedTickets`).then(setTickets);
        }
        // user
        if (role === 3) {
            return fetchWrapper.get(`api/${baseUrl}/GetMyTickets`).then(setTickets);
        }
    }

    function getById(id) {
        return fetchWrapper.get(`${baseUrl}/${id}`).then(setUser);
    }

    function update(id, params) {
        return fetchWrapper.put(`${baseUrl}/${id}`, params)
            .then(x => {
                // update stored user if the logged in user updated their own record
                if (id === auth?.id) {
                    // update local storage
                    const user = { ...auth, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // update auth user in recoil state
                    setAuth(user);
                }
                return x;
            });
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function _delete(id) {
        setUsers(users => users.map(x => {
            // add isDeleting prop to user being deleted
            if (x.id === id) 
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseUrl}/${id}`)
            .then(() => {
                // remove user from list after deleting
                setUsers(users => users.filter(x => x.id !== id));

                // auto logout if the logged in user deleted their own record
                if (id === auth?.id) {
                    logout();
                }
            });
    }
}
