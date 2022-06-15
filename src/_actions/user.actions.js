import { useRecoilState, useSetRecoilState, useResetRecoilState } from 'recoil';

import { history, useFetchWrapper } from '../_helpers';
import {authAtom, usersAtom, userAtom, ticketsAtom, ticketAtom, articlesAtom, articleAtom, tagsAtom, tagAtom  } from '../_state';

export { useUserActions };

function useUserActions () {
  const baseUrl = `${process.env.REACT_APP_API_URL}`;
  const fetchWrapper = useFetchWrapper();
  const [auth, setAuth] = useRecoilState(authAtom);
  const setUsers = useSetRecoilState(usersAtom);
  const setUser = useSetRecoilState(userAtom);
  const setTickets = useSetRecoilState(ticketsAtom);
  const setTicket = useSetRecoilState(ticketAtom);
  const setTags = useSetRecoilState(tagsAtom);
  const setArticles = useSetRecoilState(articlesAtom);
  const setArticle = useSetRecoilState(articleAtom);

  return {
    login,
    logout,
    openTicket,
    closeTicket,
    setUserRole,
    assignTicket,
    unAssignTicket,
    register,
    registerTicket,
    registerComment,
    registerArticle,
    registerTags,
    getAll,
    getAllTicketsByRole,
    getAllEngineers,
    getAllArticles,
    getAllTags,
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
    resetArticle: useResetRecoilState(articleAtom),
    resetTags: useResetRecoilState(tagsAtom),
    resetTag: useResetRecoilState(tagAtom),
  }

  function login({ username, password }) {
    return fetchWrapper.post(`${baseUrl}/users/authenticate`, { username, password })
      .then(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        setAuth(user);

        // get return url from location state or default to Home page
        const { from } = history.location.state || { from: { pathname: '/' } };
        history.push(from);
      });
  }

  function logout() {
    // remove user from local storage, set auth state to null and redirect to login page
    localStorage.removeItem('user');
    setAuth(null);
    history.push('/Account/login');
  }

  function openTicket(ticketId) {
    return fetchWrapper.post(`${baseUrl}/api/Tickets/Open/${ticketId}`, {});
  }

  function closeTicket(ticketId) {
    return fetchWrapper.post(`${baseUrl}/api/Tickets/Close/${ticketId}`, {});
  }

  function setUserRole(userId, roleId) {
    return fetchWrapper.post(`${baseUrl}/Users/SetUserRole/${userId}`, roleId);
  }

  function assignTicket(ticketId, engineerId) {
    return fetchWrapper.post(`${baseUrl}/api/Tickets/Assign/${ticketId}`, engineerId);
  }

  function unAssignTicket(ticketId) {
    return fetchWrapper.post(`${baseUrl}/api/Tickets/Unassign/${ticketId}`);
  }

  function register(user) {
    return fetchWrapper.post(`${baseUrl}/users/register`, user);
  }

  function registerTicket(ticket) {
    return fetchWrapper.post(`${baseUrl}/api/Tickets`, ticket);
  }

  function registerArticle(article) {
    console.log(article);
    return fetchWrapper.post(`${baseUrl}/api/knowledgebasearticle`, article);
  }

  function registerComment(comment) {
    return fetchWrapper.post(`${baseUrl}/api/Comment`, comment);
  }

  function registerTags(tag) {
    return fetchWrapper.post(`${baseUrl}/api/Tags`, tag);
  }

  function getAll() {
    return fetchWrapper.get(`${baseUrl}/users`).then(setUsers);
  }

  function getAllEngineers() {
    return fetchWrapper.get(`${baseUrl}/users/getAllEngineers`).then(setUsers);
  }

  function getAllArticles() {
    return fetchWrapper.get(`${baseUrl}/api/knowledgebasearticle`).then(setArticles);
  }

  function getAllTags() {
    return fetchWrapper.get(`${baseUrl}/api/Tags/getAllTags`).then(setTags);
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
    return fetchWrapper.get(`${baseUrl}/users/${id}`).then(setUser);
  }

  function getTicketById(id) {
    return fetchWrapper.get(`${baseUrl}/api/tickets/${id}`).then(setTicket);
  }

  function getArticleById(id) {
    return fetchWrapper.get(`${baseUrl}/api/knowledgebasearticle/${id}`).then(setArticle);
  }

  function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/users/${id}`, params)
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

    return fetchWrapper.delete(`${baseUrl}/users/${id}`)
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
        // remove ticket from list after deleting
        setTickets(tickets => tickets.filter(x => x.id !== id));
      });
  }

  function deleteArticle(id) {
    setArticles(articles => articles.map(x => {
      // add isDeleting prop to user being deleted
      if (x.knowledgeBaseArticleId === id)
        return { ...x, isDeleting: true };

      return x;
    }));

    return fetchWrapper.delete(`${baseUrl}/api/knowledgebasearticle/${id}`)
      .then(() => {
        // remove article from list after deleting
        setArticles(articles => articles.filter(x => x.knowledgeBaseArticleId !== id));
      });
  }

  function deleteComment(id) {
    return fetchWrapper.delete(`${baseUrl}/api/comment/${id}`)
      .then();
  }
}
