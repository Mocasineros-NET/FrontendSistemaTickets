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

const commentsAtom = atom({
    key: 'comments',
    default: null
});

const commentAtom = atom({
    key: 'comment',
    default: null
});

const articlesAtom = atom({
    key: 'articles',
    default: null
});

const articleAtom = atom({
    key: 'article',
    default: null
})

export { 
    usersAtom,
    userAtom,
    ticketsAtom,
    ticketAtom,
    commentsAtom,
    commentAtom,
    articlesAtom,
    articleAtom
};