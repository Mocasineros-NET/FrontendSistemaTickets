import { StateCreator } from "./StateCreator";

const articlesInitializer = () => {
  const stateCreator = new StateCreator();
  return stateCreator.factoryMethod("articles", null);
};

const articleInitializer = () => {
  const stateCreator = new StateCreator();
  return stateCreator.factoryMethod("article", null);
};

const articlesAtom = articlesInitializer().getAtom();
const articleAtom = articleInitializer().getAtom();

export { articlesAtom, articleAtom };