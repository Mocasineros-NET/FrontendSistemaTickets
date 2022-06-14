import { StateCreator } from "./StateCreator";

const ticketsInitializer = () => {
  const stateCreator = new StateCreator();
  return stateCreator.factoryMethod("Tickets", null);
};

const ticketInitializer = () => {
  const stateCreator = new StateCreator();
  return stateCreator.factoryMethod("ticket", null);
};

const ticketsAtom = ticketsInitializer().getAtom();
const ticketAtom = ticketInitializer().getAtom();

export { ticketsAtom, ticketAtom };