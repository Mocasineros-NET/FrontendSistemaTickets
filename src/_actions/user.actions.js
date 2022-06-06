import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';

import { history, useFetchWrapper } from '_helpers';
import {authAtom, usersAtom, userAtom, ticketsAtom, ticketAtom, commentsAtom, commentAtom, articlesAtom, articleAtom } from '_state';

export { useUserActions };

function useUserActions () {
    const baseUrl = `${process.env.REACT_APP_API_URL}`;
    const fetchWrapper = useFetchWrapper();
    const [auth, setAuth] = useRecoilState(authAtom);
    const setUsers = useSetRecoilState(usersAtom);
    const setUser = useSetRecoilState(userAtom);
    const setTickets = useSetRecoilState(ticketsAtom);
    const setTicket = useSetRecoilState(ticketAtom);
    const setComments = useSetRecoilState(commentsAtom);
    const setComment = useSetRecoilState(commentAtom);
    const setArticles = useSetRecoilState(articlesAtom);
    const setArticle = useSetRecoilState(articleAtom);

    return {
        login,
        logout,
        register,
        registerTicket,
        registerComment,
        registerArticle,
        getAll,
        getAllTicketsByRole,
        getAllArticles,
        getById,
        getTicketById,
        getArticleById,
        update,
        updateTicket,
        updateArticle,
        deleteUser,
        deleteTicket,
        deleteComment,
        deleteArticle,
        resetUsers: useResetRecoilState(usersAtom),
        resetUser: useResetRecoilState(userAtom),
        resetTickets: useResetRecoilState(ticketsAtom),
        resetTicket: useResetRecoilState(ticketAtom),
        resetArticles: useResetRecoilState(articlesAtom),
        resetArticle: useResetRecoilState(articleAtom)
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

    function registerTicket(ticket) {
        return fetchWrapper.post(`${baseUrl}/api/Tickets`, ticket);
    }

    function registerArticle(article) {
        return fetchWrapper.post(`${baseUrl}/api/knowledgebasearticle`, article);
    }

    function registerComment(comment) {
        return fetchWrapper.post(`${baseUrl}/api/Comment`, comment);
    }

    function getAll() {
        return fetchWrapper.get(`${baseUrl}/users`).then(setUsers);
    }

    function getAllArticles() {
        return fetchWrapper.get(`${baseUrl}/api/knowledgebasearticle`).then(setArticles);
    }

    function getAllTicketsByRole(role) {
        // admin
        if (role === 0) {
            return fetchWrapper.get(`${baseUrl}/api/tickets`).then(setTickets);
        }
        // manager
        if (role === 1) {
            return fetchWrapper.get(`${baseUrl}/api/Tickets`).then(setTickets);
        }
        // engineer
        if (role === 2) {
            return fetchWrapper.get(`${baseUrl}/api/tickets/GetMyAssignedTickets`).then(setTickets);
        }
        // user
        if (role === 3) {
            return fetchWrapper.get(`${baseUrl}/api/tickets/GetMyTickets`).then(setTickets);
        }
    }

    function getById(id) {
        return fetchWrapper.get(`${baseUrl}/${id}`).then(setUser);
    }

    function getTicketById(id) {
        return fetchWrapper.get(`${baseUrl}/api/tickets/${id}`).then(setTicket);
    }

    function getArticleById(id) {
        return fetchWrapper.get(`${baseUrl}/api/knowledgebasearticle/${id}`).then(setTicket);
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

    function updateTicket(id, params) {
        return fetchWrapper.put(`${baseUrl}/api/Tickets/${id}`, params)
          .then(x => {
              return x;
          });
    }

    function updateArticle(id, params) {
        return fetchWrapper.put(`${baseUrl}/api/knowledgebasearticle/${id}`, params)
          .then(x => {
              return x;
          });
    }

    // prefixed with underscored because delete is a reserved word in javascript
    function deleteUser(id) {
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

    function deleteTicket(id) {
        setTickets(tickets => tickets.map(x => {
            // add isDeleting prop to user being deleted
            if (x.id === id)
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseUrl}/api/tickets/${id}`)
          .then(() => {
              // remove user from list after deleting
              setTickets(tickets => tickets.filter(x => x.id !== id));
          });
    }

    function deleteArticle(id) {
        setArticles(articles => articles.map(x => {
            // add isDeleting prop to user being deleted
            if (x.id === id)
                return { ...x, isDeleting: true };

            return x;
        }));

        return fetchWrapper.delete(`${baseUrl}/api/knowledgebasearticle/${id}`)
          .then(() => {
              // remove user from list after deleting
              setArticles(articles => articles.filter(x => x.id !== id));
          });
    }

    function deleteComment(id) {
        return fetchWrapper.delete(`${baseUrl}/api/comment/${id}`)
          .then();
    }
}
