export namespace Typed {
  class Transition<T> {
    private _toState: T;
    private _fromState: T;

    get toState() {
      return this._toState;
    }

    get fromState() {
      return this._fromState;
    }

    get Transition(): { toState: T; fromState: T } {
      return {
        toState: this._toState,
        fromState: this._fromState,
      };
    }

    constructor(toState: T, fromState: T) {
      this._toState = toState;
      this._fromState = fromState;
    }
  }

  class State<T> {
    private _fsm: FSM<T>;
    private _state: T;
    private _transitions: Transition<T>[];

    get state(): T {
      return this._state;
    }

    get toStates(): T[] {
      if (this._transitions) {
        return [
          ...this._transitions.map((transition: Transition<T>) => {
            return transition.toState;
          }),
        ];
      }
      return [];
    }

    get fromStates(): T[] {
      if (this._transitions) {
        return [
          ...this._transitions.map((transition: Transition<T>) => {
            return transition.fromState;
          }),
        ];
      }
      return [];
    }

    constructor(fsm: FSM<T>, state: T) {
      this._fsm = fsm;
      this._state = state;
    }

    to(toState: T): State<T> {
      this._transitions = this._transitions ? this._transitions : [];

      //

      let exisitingTransition: Transition<T>;

      const isNewTransition = this._transitions.every(
        (value: Transition<T>, index: Number, array: Transition<T>[]) => {
          exisitingTransition = value;
          return value.toState !== toState;
        },
      );

      if (isNewTransition) {
        const transition = new Transition<T>(toState, this.state);
        this._transitions.push(transition);
      }

      return this;
    }

    from(fromState: T): State<T> {
      this._fsm.from(fromState).to(this.state);
      return this;
    }

    toFrom(toFromState: T): State<T> {
      this.to(toFromState);
      this.from(toFromState);
      return this;
    }
  }

  export class FSM<T> {
    private _defaultState: State<T>;
    private _currentState: State<T>;
    private _states: State<T>[];

    get states(): State<T>[] {
      return this._states;
    }

    get defaultState(): T {
      return this._defaultState.state;
    }

    get currentState(): T {
      return this._currentState.state;
    }

    constructor(defaultState: T) {
      this._defaultState = new State(this, defaultState);
      this._currentState = this._defaultState;
    }

    from(addState: T): State<T> {
      this._states = this._states ? this._states : [];

      let exisitingState: State<T>;

      const isNewState = this._states.every(
        (value: State<T>, index: Number, array: State<T>[]) => {
          exisitingState = value;
          return value.state !== addState;
        },
      );

      if (isNewState) {
        const state = new State<T>(this, addState);
        this._states.push(state);
        return state;
      }

      return exisitingState;
    }

    debug() {
      if (this._states) {
        this._states.map((state: State<T>) => {
          console.log(state.state, ' ---> ', state.toStates);
        });
      }
    }
  }
}
