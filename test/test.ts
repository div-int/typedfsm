import { Typed } from '../src/typedfsm';
import { expect } from 'chai';

const enum GhostStates {
  Waiting = 'Waiting',
  Chasing = 'Chasing',
  Scatter = 'Scatter',
  Frightened = 'Frightened',
  Eaten = 'Eaten',
  Paused = 'Paused',
}

const enum GhostActions {
  Wait = 'Wait',
  Chase = 'Chase',
  Scatter = 'Scatter',
  Frighten = 'Frighten',
  Eat = 'Eat',
  Pause = 'Pause',
}

let ghostState: Typed.FSM<GhostStates, GhostActions>;

describe('Create ghost state machine with default state of waiting.', () => {
  ghostState = new Typed.FSM<GhostStates, GhostActions>(GhostStates.Waiting);

  it('Is current state waiting?', () => {
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
});

describe('Create ghost states and actions.', () => {
  ghostState
    .from(GhostStates.Waiting, GhostActions.Wait)
    .to(GhostStates.Chasing, GhostActions.Chase)
    .to(GhostStates.Scatter, GhostActions.Scatter)
    .toFrom(GhostStates.Paused, GhostActions.Pause);

  ghostState
    .from(GhostStates.Chasing, GhostActions.Chase)
    .toFrom(GhostStates.Scatter, GhostActions.Scatter)
    .toFrom(GhostStates.Frightened, GhostActions.Frighten)
    .toFrom(GhostStates.Paused, GhostActions.Pause);

  ghostState
    .from(GhostStates.Scatter, GhostActions.Scatter)
    .toFrom(GhostStates.Chasing, GhostActions.Chase)
    .toFrom(GhostStates.Frightened, GhostActions.Frighten)
    .toFrom(GhostStates.Paused, GhostActions.Pause);

  ghostState
    .from(GhostStates.Frightened, GhostActions.Frighten)
    .to(GhostStates.Eaten, GhostActions.Eat)
    .toFrom(GhostStates.Paused, GhostActions.Pause);

  ghostState
    .from(GhostStates.Eaten, GhostActions.Eat)
    .to(GhostStates.Scatter, GhostActions.Scatter)
    .to(GhostStates.Chasing, GhostActions.Chase)
    .toFrom(GhostStates.Paused, GhostActions.Pause);

  it('Can change state to paused?', () => {
    ghostState.change(GhostStates.Paused);
    expect(ghostState.currentState).to.equal(GhostStates.Paused);
  });
  it('Can change state to waiting?', () => {
    ghostState.change(GhostStates.Waiting);
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
  it("Can't change state to frightened? ", () => {
    const canChangeResult = ghostState.canChange(GhostStates.Frightened);
    expect(canChangeResult).to.equal(false);
  });
  it('Can change state to chasing?', () => {
    ghostState.change(GhostStates.Chasing);
    expect(ghostState.currentState).to.equal(GhostStates.Chasing);
  });

  it('Can perform action pause?', () => {
    ghostState.reset();
    ghostState.do(GhostActions.Pause);
    expect(ghostState.currentState).to.equal(GhostStates.Paused);
  });
  it('Can perform action wait?', () => {
    ghostState.do(GhostActions.Wait);
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
  it("Can't perform action frighten? ", () => {
    const canChangeResult = ghostState.canDo(GhostActions.Frighten);
    expect(canChangeResult).to.equal(false);
  });
  it('Can perform action chase?', () => {
    ghostState.do(GhostActions.Chase);
    expect(ghostState.currentState).to.equal(GhostStates.Chasing);
  });
  it('Can perform action pause?', () => {
    ghostState.do(GhostActions.Pause);
    expect(ghostState.currentState).to.equal(GhostStates.Paused);
  });

  it('Does resetting change state to waiting?', () => {
    ghostState.reset();
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
});

let resultOnPreChange: string;
let resultOnPostChange: string;

describe('Create on pre change state callback.', () => {
  // tslint:disable-next-line: ter-arrow-parens
  it('Before doing action chase from waiting.', done => {
    ghostState.OnPreChange = (
      from: GhostStates,
      to: GhostStates,
      action: GhostActions,
    ): boolean => {
      resultOnPreChange = `${from} do ${action}`;
      return true;
    };

    ghostState.reset();
    ghostState.do(GhostActions.Chase);
    expect(resultOnPreChange).to.equal('Waiting do Chase');
    done();
  });
});

describe('Create on post change state callback.', () => {
  // tslint:disable-next-line: ter-arrow-parens
  it('After doing action pause from waiting.', done => {
    ghostState.OnPostChange = (
      from: GhostStates,
      to: GhostStates,
      action: GhostActions,
    ): void => {
      resultOnPostChange = `${from} ===> ${to} do ${action}`;
      console.log(resultOnPostChange);
    };

    ghostState.reset();
    ghostState.do(GhostActions.Scatter);
    expect(resultOnPostChange).to.equal('Waiting ===> Scatter do Scatter');
    done();
  });
});
