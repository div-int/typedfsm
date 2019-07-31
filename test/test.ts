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

const ghostState = new Typed.FSM<GhostStates, GhostActions>(
  GhostStates.Waiting,
);

describe('Create ghost state machine with default state of waiting.', () => {
  it('Is current state waiting?', () => {
    ghostState.reset();
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
});

describe('Create ghost states and actions.', () => {
  ghostState
    .from(GhostStates.Waiting, GhostActions.Wait)
    .to(GhostStates.Chasing, GhostActions.Chase)
    .to(GhostStates.Scatter, GhostActions.Scatter)
    .to(GhostStates.Paused, GhostActions.Pause)
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
  it('Can change state back to paused?', () => {
    ghostState.change(GhostStates.Paused);
    expect(ghostState.currentState).to.equal(GhostStates.Paused);
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

let resultOnPostChange: string;

describe('Create on pre change state callback.', () => {
  it('Should be same state if we cancel it? (change)', () => {
    ghostState.OnPreChange = (
      from: GhostStates,
      to: GhostStates,
      action: GhostActions,
    ): boolean => {
      return false;
    };

    ghostState.reset();
    ghostState.change(GhostStates.Chasing);
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });

  it("Should be chasing if we don't cancel it? (change)", () => {
    ghostState.OnPreChange = (
      from: GhostStates,
      to: GhostStates,
      action: GhostActions,
    ): boolean => {
      return true;
    };

    ghostState.reset();
    ghostState.change(GhostStates.Chasing);
    expect(ghostState.currentState).to.equal(GhostStates.Chasing);
  });
  it('Should be same state if we cancel it? (do)', () => {
    ghostState.OnPreChange = (
      from: GhostStates,
      to: GhostStates,
      action: GhostActions,
    ): boolean => {
      return false;
    };

    ghostState.reset();
    ghostState.do(GhostActions.Chase);
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });

  it("Should be chasing if we don't cancel it? (do)", () => {
    ghostState.OnPreChange = (
      from: GhostStates,
      to: GhostStates,
      action: GhostActions,
    ): boolean => {
      return true;
    };

    ghostState.reset();
    ghostState.do(GhostActions.Chase);
    expect(ghostState.currentState).to.equal(GhostStates.Chasing);
  });
});

describe('Create on post change state callback.', () => {
  it('Should be scatter after callback? (change)', () => {
    ghostState.OnPostChange = (
      from: GhostStates,
      to: GhostStates,
      action: GhostActions,
    ): void => {
      resultOnPostChange = `${from} ===> ${to} do ${action}`;
    };

    ghostState.reset();
    ghostState.change(GhostStates.Scatter);
    expect(ghostState.currentState).to.equal(GhostStates.Scatter);
  });
  it('Should be scatter after callback? (do)', () => {
    ghostState.OnPostChange = (
      from: GhostStates,
      to: GhostStates,
      action: GhostActions,
    ): void => {
      resultOnPostChange = `${from} ===> ${to} do ${action}`;
    };

    ghostState.reset();
    ghostState.do(GhostActions.Scatter);
    expect(ghostState.currentState).to.equal(GhostStates.Scatter);
  });
});

describe('Check if we can perform invalid actions or state changes.', () => {
  it('Should return an error if given invalid action? (do)', () => {
    ghostState.reset();
    const result = ghostState.do(GhostActions.Eat);
    expect(result instanceof Error).to.equal(true);
  });

  it('Should return an error if given invalid state? (change)', () => {
    ghostState.reset();
    const result = ghostState.change(GhostStates.Eaten);
    expect(result instanceof Error).to.equal(true);
  });
});
