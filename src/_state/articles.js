import { atom } from 'recoil';

const articlesAtom = atom({
  key: 'articles',
  default: null
});

const articleAtom = atom({
  key: 'article',
  default: null
});

export {
  articlesAtom,
  articleAtom
};