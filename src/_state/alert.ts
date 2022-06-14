import {StateCreator} from "./StateCreator";

const alertInitializer = () => {
  const stateCreator = new StateCreator();
  return stateCreator.factoryMethod("alert", null);
};

const alertAtom = alertInitializer().getAtom();

export { alertAtom };