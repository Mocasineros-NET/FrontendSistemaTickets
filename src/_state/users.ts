import { StateCreator } from "./StateCreator";

const usersInitializer = () => {
  const stateCreator = new StateCreator();
  return stateCreator.factoryMethod("Users", null);
};

const userInitializer = () => {
  const stateCreator = new StateCreator();
  return stateCreator.factoryMethod("user", null);
};

const usersAtom = usersInitializer().getAtom();
const userAtom = userInitializer().getAtom();

export { usersAtom, userAtom };