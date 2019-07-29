export namespace Typed {
  class Transition<T, K> {
    private _fsm: FSM<T, K>;
    private _fromState: T;
    private _toState: T;
    private _action: K;

    get fromState() {
      return this._fromState;
    }

    get toState() {
      return this._toState;
    }

    get action() {
      return this._action;
    }

    constructor(fsm: FSM<T, K>, fromState: T, toState: T, action?: K) {
      this._fsm = fsm;
      this._fromState = fromState;
      this._toState = toState;
      this._action = action;
    }

    to(toState: T, action?: K): Transition<T, K> {
      if (this._fsm.isTransition(this.fromState, toState)) return this;

      if (this._toState === null) {
        this._toState = toState;
        this._action = action;
        this._fsm.transitions.push(this);
        return this;
      }

      if (!this._fsm.isTransition(this.fromState, toState)) {
        this._fsm.from(this.fromState).to(toState);
      }

      return this;
    }

    toFrom(toFromState: T, toAction?: K, fromAction?: K): Transition<T, K> {
      if (this._fsm.isTransition(this.fromState, toFromState)) return this;

      if (this._toState === null) {
        this._toState = toFromState;
      }

      if (!this._fsm.isTransition(toFromState, this.fromState)) {
        this._fsm.from(toFromState).to(this.fromState, fromAction);
      }
      if (!this._fsm.isTransition(this.fromState, toFromState)) {
        this._fsm.from(this.fromState).to(toFromState, toAction);
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
  export class FSM<T, K> {
    private _defaultState: T;
    private _currentState: T;
    private _transitions: Transition<T, K>[];
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

    get transitions(): Transition<T, K>[] {
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
        (value: Transition<T, K>, index: Number, array: Transition<T, K>[]) => {
          return !(value.fromState === fromState && value.toState === toState);
        },
      );
    }

    isAction(fromState: T, action: K): boolean {
      return !this._transitions.every(
        (value: Transition<T, K>, index: Number, array: Transition<T, K>[]) => {
          return !(value.fromState === fromState && value.action === action);
        },
      );
    }

    reset() {
      this._currentState = this.defaultState;
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

    canDo(action: K): boolean {
      return this.isAction(this.currentState, action);
    }

    do(action: K): T | Error {
      return new Error(
        `Can't perform action ${action} in state ${this.currentState}`,
      );
    }

    from(fromState: T): Transition<T, K> {
      this._transitions = this._transitions ? this._transitions : [];

      let exisitingTransition: Transition<T, K>;

      if (
        this._transitions.every(
          (
            value: Transition<T, K>,
            index: Number,
            array: Transition<T, K>[],
          ) => {
            exisitingTransition = value;
            return !(value.fromState === fromState && value.toState === null);
          },
        )
      ) {
        const transition = new Transition<T, K>(this, fromState, null);

        return transition;
      }

      return exisitingTransition;
    }
  }
}
