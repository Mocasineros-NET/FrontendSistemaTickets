import { StateCreator } from "./StateCreator";

const authInitializer = () => {
  const stateCreator = new StateCreator();
  return stateCreator.factoryMethod("auth", JSON.parse(localStorage.getItem("user")!));
};

const authAtom = authInitializer().getAtom();

export { authAtom };