import { atom } from 'recoil';

const commentsAtom = atom({
  key: 'comments',
  default: null
});

const commentAtom = atom({
  key: 'comment',
  default: null
});

export {
  commentsAtom,
  commentAtom
};