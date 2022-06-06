import { atom } from 'recoil';

const usersAtom = atom({
    key: 'users',
    default: null
});

const userAtom = atom({
    key: 'user',
    default: null
});

const ticketsAtom = atom({
    key: 'tickets',
    default: null
});

const ticketAtom = atom({
    key: 'ticket',
    default: null
});

export { 
    usersAtom,
    userAtom,
    ticketsAtom,
    ticketAtom
};