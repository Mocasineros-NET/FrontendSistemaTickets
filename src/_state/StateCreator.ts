import {State} from "./stateInterface";
import {atom} from "recoil";

class ConcreteState implements State {
  public _key: string;
  public _default: null | string;
  public _atom: any;

  constructor(_key:string, _default:null | string) {
    this._key = _key;
    this._default = _default;
    this._atom = atom({
      key: this._key,
      default: this._default
    })
  }

  public getAtom() {
    return this._atom;
  }
}

class StateCreator {
  public factoryMethod(_key: string, _default: null | string) {
    return new ConcreteState(_key, _default);
  }
}

export { StateCreator };