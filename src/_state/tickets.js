import { atom } from 'recoil';

const ticketsAtom = atom({
  key: 'tickets',
  default: null
});

const ticketAtom = atom({
  key: 'ticket',
  default: null
});

export {
  ticketsAtom,
  ticketAtom
}