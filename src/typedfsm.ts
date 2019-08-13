export namespace Typed {
  export interface OnPreChange<T, K> {
    (from: T, to: T, action: K): boolean;
  }

  export interface OnPostChange<T, K> {
    (from: T, to: T, action: K): void;
  }

  class Transition<T, K> {
    private _fsm: FSM<T, K>;
    private _fromState: T;
    private _fromAction: K;
    private _toState: T;
    private _toAction: K;

    get fromState() {
      return this._fromState;
    }

    get fromAction() {
      return this._fromAction;
    }

    get toState() {
      return this._toState;
    }

    get toAction() {
      return this._toAction;
    }

    constructor(fsm: FSM<T, K>, fromState: T, fromAction: K, toState: T, toAction?: K) {
      this._fsm = fsm;
      this._fromState = fromState;
      this._fromAction = fromAction;
      this._toState = toState;
      this._toAction = toAction;
    }

    to(toState: T, toAction?: K): Transition<T, K> {
      if (this._fsm.isTransition(this.fromState, toState)) {
        return this;
      }

      if (this._toState === null) {
        this._toState = toState;
        this._toAction = toAction;

        this._fsm.transitions.push(this);
        return this;
      }

      this._fsm.from(this.fromState, this.fromAction).to(toState, toAction);

      return this;
    }

    toFrom(toFromState: T, toAction?: K): Transition<T, K> {
      if (!this._fsm.isTransition(toFromState, this.fromState)) {
        this._fsm.from(toFromState, toAction).to(this.fromState, this.fromAction);
      }
      if (!this._fsm.isTransition(this.fromState, toFromState)) {
        this._fsm.from(this.fromState, this.fromAction).to(toFromState, toAction);
      }

      return this;
    }
  }

  export class FSM<T, K> {
    private _defaultState: T;
    private _currentState: T;
    private _transitions: Transition<T, K>[];
    private _onPreChange: OnPreChange<T, K>;
    private _onPostChange: OnPostChange<T, K>;

    get defaultState(): T {
      return this._defaultState;
    }

    get currentState(): T {
      return this._currentState;
    }

    get transitions(): Transition<T, K>[] {
      this._transitions = this._transitions ? this._transitions : [];

      return this._transitions;
    }

    set OnPreChange(onPreChange: OnPreChange<T, K>) {
      this._onPreChange = onPreChange;
    }

    set OnPostChange(onPostChange: OnPostChange<T, K>) {
      this._onPostChange = onPostChange;
    }

    constructor(defaultState: T) {
      this._defaultState = defaultState;
      this._currentState = defaultState;
    }

    reset() {
      this._currentState = this.defaultState;
    }

    findTransition(fromState: T, toState: T): Transition<T, K> {
      let result: Transition<T, K>;

      this.transitions.every((value: Transition<T, K>) => {
        if (value.fromState === fromState && value.toState === toState) {
          result = value;
          return false;
        }

        return true;
      });

      return result;
    }

    isTransition(fromState: T, toState: T): boolean {
      return !(this.findTransition(fromState, toState) == null);
    }

    findAction(fromState: T, toAction: K): Transition<T, K> {
      let result: Transition<T, K>;

      this.transitions.every((value: Transition<T, K>) => {
        if (value.fromState === fromState && value.toAction === toAction) {
          result = value;
          return false;
        }

        return true;
      });

      return result;
    }

    isAction(fromState: T, toAction: K): boolean {
      return !(this.findAction(fromState, toAction) == null);
    }

    canChange(changeState: T): boolean {
      return this.isTransition(this.currentState, changeState);
    }

    change(changeState: T): T | Error {
      if (this._onPreChange) {
        if (!this._onPreChange(this.currentState, changeState, null)) {
          return this.currentState;
        }
      }

      let foundTransition: Transition<T, K>;

      if ((foundTransition = this.findTransition(this.currentState, changeState))) {
        if (this._onPostChange) {
          this._onPostChange(this.currentState, changeState, foundTransition.toAction);
        }

        return (this._currentState = changeState);
      }

      return new Error(`Can't change from ${this.currentState} to ${changeState}`);
    }

    canDo(doAction: K): boolean {
      return this.isAction(this.currentState, doAction);
    }

    do(doAction: K): T | Error {
      if (this._onPreChange) {
        if (!this._onPreChange(this.currentState, null, doAction)) {
          return this.currentState;
        }
      }

      let foundAction: Transition<T, K>;

      if ((foundAction = this.findAction(this.currentState, doAction))) {
        if (this._onPostChange) {
          this._onPostChange(this.currentState, foundAction.toState, doAction);
        }

        return (this._currentState = foundAction.toState);
      }

      return new Error(`Can't perform action ${doAction} with state ${this.currentState}`);
    }

    async doAfter(doAction: K, doAfter: number): Promise<T> {
      // throw Error(`doAfter(${doAction}, ${doAfter}) : Not implemented`);
      return new Promise<T>(resolve => setTimeout(resolve, doAfter));
    }

    from(fromState: T, fromAction?: K): Transition<T, K> {
      return new Transition<T, K>(this, fromState, fromAction, null, null);
    }
  }
}
