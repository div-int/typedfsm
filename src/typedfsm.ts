export namespace Typed {
  class Transition<T> {
    private toState: T;
    private fromState: T;

    get ToState() {
      return this.toState;
    }

    get FromState() {
      return this.fromState;
    }

    get Transition(): { toState: T; fromState: T } {
      return {
        toState: this.toState,
        fromState: this.fromState,
      };
    }

    constructor(toState: T, fromState: T) {
      this.toState = toState;
      this.fromState = fromState;
    }
  }

  class State<T> {
    private fsm: FSM<T>;
    private state: T;
    private transitions: Transition<T>[];

    get State(): T {
      return this.state;
    }

    get ToStates(): T[] {
      if (this.transitions) {
        return [
          ...this.transitions.map((transition: Transition<T>) => {
            return transition.ToState;
          }),
        ];
      }
      return [];
    }

    get FromStates(): T[] {
      if (this.transitions) {
        return [
          ...this.transitions.map((transition: Transition<T>) => {
            return transition.FromState;
          }),
        ];
      }
      return [];
    }

    constructor(fsm: FSM<T>, state: T) {
      this.fsm = fsm;
      this.state = state;
    }

    to(toState: T): State<T> {
      this.transitions = this.transitions ? this.transitions : [];

      //

      let exisitingTransition: Transition<T>;

      const isNewTransition = this.transitions.every(
        (value: Transition<T>, index: Number, array: Transition<T>[]) => {
          exisitingTransition = value;
          return value.ToState !== toState;
        },
      );

      if (isNewTransition) {
        const transition = new Transition<T>(toState, this.state);
        this.transitions.push(transition);
      }

      return this;
    }

    from(fromState: T): State<T> {
      this.fsm.add(fromState).to(this.state);
      return this;
    }

    toFrom(toFromState: T): State<T> {
      this.to(toFromState);
      this.from(toFromState);
      return this;
    }
  }

  export class FSM<T> {
    private defaultState: State<T>;
    private currentState: State<T>;
    private states: State<T>[];

    get States(): State<T>[] {
      return this.states;
    }

    get DefaultState(): T {
      return this.defaultState.State;
    }

    get CurrentState(): T {
      return this.currentState.State;
    }

    constructor(defaultState: T) {
      this.defaultState = new State(this, defaultState);
      this.currentState = this.defaultState;
    }

    add(addState: T): State<T> {
      this.states = this.states ? this.states : [];

      let exisitingState: State<T>;

      const isNewState = this.states.every(
        (value: State<T>, index: Number, array: State<T>[]) => {
          exisitingState = value;
          return value.State !== addState;
        },
      );

      if (isNewState) {
        const state = new State<T>(this, addState);
        this.states.push(state);
        return state;
      }

      return exisitingState;
    }

    debug() {
      if (this.states) {
        this.states.map((state: State<T>) => {
          console.log(state.State, ' ---> ', state.ToStates);
        });
      }
    }
  }
}
