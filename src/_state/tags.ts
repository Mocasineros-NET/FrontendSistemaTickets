import { StateCreator } from "./StateCreator";

const tagsInitializer = () => {
  const stateCreator = new StateCreator();
  return stateCreator.factoryMethod("tags", null);
};

const tagInitializer = () => {
  const stateCreator = new StateCreator();
  return stateCreator.factoryMethod("tag", null);
};

const tagsAtom = tagsInitializer().getAtom();
const tagAtom = tagInitializer().getAtom();

export { tagsAtom, tagAtom };