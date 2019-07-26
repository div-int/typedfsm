export namespace Typed {
  class Transition<T> {
    private _fsm: FSM<T>;
    private _fromState: T;
    private _toState: T;

    get fromState() {
      return this._fromState;
    }

    get toState() {
      return this._toState;
    }

    // get Transition(): { fromState: T; toState: T } {
    //   return {
    //     fromState: this._fromState,
    //     toState: this._toState,
    //   };
    // }

    constructor(fsm: FSM<T>, fromState: T, toState: T) {
      this._fsm = fsm;
      this._fromState = fromState;
      this._toState = toState;
    }

    to(toState: T, transitionName?: string): Transition<T> {
      if (this._fsm.isTransition(this.fromState, toState)) return this;

      if (this._toState === null) {
        this._toState = toState;
        this._fsm.transitions.push(this);
        return this;
      }

      if (!this._fsm.isTransition(this.fromState, toState)) {
        this._fsm.from(this.fromState).to(toState);
      }

      return this;
    }

    toFrom(toFromState: T, transitionName?: string): Transition<T> {
      if (this._fsm.isTransition(this.fromState, toFromState)) return this;

      if (this._toState === null) {
        this._toState = toFromState;
      }

      if (!this._fsm.isTransition(toFromState, this.fromState)) {
        this._fsm.from(toFromState, transitionName).to(this.fromState);
      }
      if (!this._fsm.isTransition(this.fromState, toFromState)) {
        this._fsm.from(this.fromState).to(toFromState);
      }

      return this;
    }
  }

  export interface OnPreChange<T> {
    (from: T, to: T): boolean;
  }

  export interface OnPostChange<T> {
    (from: T, to: T): boolean;
  }
  export interface OnEnter<T> {
    (from: T, to: T): boolean;
  }
  export interface OnLeave<T> {
    (from: T, to: T): boolean;
  }
  export class FSM<T> {
    private _defaultState: T;
    private _currentState: T;
    private _transitions: Transition<T>[];
    private _onPreChange: OnPreChange<T>;
    private _onPostChange: OnPostChange<T>;
    private _onEnterState: OnEnter<T>;
    private _onLeaveState: OnLeave<T>;

    get defaultState(): T {
      return this._defaultState;
    }

    get currentState(): T {
      return this._currentState;
    }

    get transitions(): Transition<T>[] {
      return this._transitions;
    }

    set OnPreChange(onPreChange: OnPreChange<T>) {
      this._onPreChange = onPreChange;
    }

    set OnPostChange(onPostChange: OnPostChange<T>) {
      this._onPostChange = onPostChange;
    }

    set OnEnterState(onEnterState: OnEnter<T>) {
      this._onEnterState = onEnterState;
    }

    set OnLeaveState(onLeaveState: OnLeave<T>) {
      this._onLeaveState = onLeaveState;
    }

    constructor(defaultState: T) {
      this._defaultState = defaultState;
      this._currentState = defaultState;
    }

    isTransition(fromState: T, toState: T): boolean {
      return !this._transitions.every(
        (value: Transition<T>, index: Number, array: Transition<T>[]) => {
          return !(value.fromState === fromState && value.toState === toState);
        },
      );
    }

    canChange(changeState: T): boolean {
      return this.isTransition(this.currentState, changeState);
    }

    change(changeState: T): T | Error {
      if (this._onPreChange) {
        if (!this._onPreChange(this.currentState, changeState)) {
          return this.currentState;
        }
      }
      if (this.canChange(changeState)) {
        if (this._onPostChange) {
          if (this._onPostChange(this.currentState, changeState)) {
            return (this._currentState = changeState);
          }

          return this._currentState;
        }

        return (this._currentState = changeState);
      }

      return new Error(
        `Can't change from ${this.currentState} to ${changeState}`,
      );
    }

    from(fromState: T, transitionName?: string): Transition<T> {
      this._transitions = this._transitions ? this._transitions : [];

      let exisitingTransition: Transition<T>;

      if (
        this._transitions.every(
          (value: Transition<T>, index: Number, array: Transition<T>[]) => {
            exisitingTransition = value;
            return !(value.fromState === fromState && value.toState === null);
          },
        )
      ) {
        const transition = new Transition<T>(this, fromState, null);

        // this._transitions.push(transition);
        return transition;
      }

      return exisitingTransition;
    }

    debug() {
      console.log(this.currentState);

      if (this._transitions) {
        this._transitions.map((transition: Transition<T>) => {
          console.log(
            transition.fromState,
            /*transition.fromName,*/
            ' ---> ',
            transition.toState,
          );
        });
      }
    }
  }
}
