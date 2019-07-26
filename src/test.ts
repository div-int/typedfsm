import { Typed } from './typedfsm';
import { expect } from 'chai';

const enum GhostStates {
  Waiting = 'Waiting',
  Chasing = 'Chasing',
  Scatter = 'Scatter',
  Frightened = 'Frightened',
  Eaten = 'Eaten',
  Paused = 'Paused',
}

const ghostState = new Typed.FSM<GhostStates>(GhostStates.Waiting);

describe('const ghostState = new Typed.FSM<GhostStates>(GhostStates.Waiting);', () => {
  it('Create GhostState FSM', () => {
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
});

ghostState
  .from(GhostStates.Waiting)
  .to(GhostStates.Chasing)
  .toFrom(GhostStates.Paused);

describe('[Waiting] <==> [Paused]', () => {
  it('Change state both ways', () => {
    expect(true);
  });
});

ghostState
  .from(GhostStates.Chasing)
  .toFrom(GhostStates.Scatter)
  .toFrom(GhostStates.Frightened)
  .toFrom(GhostStates.Paused);

ghostState
  .from(GhostStates.Scatter)
  .toFrom(GhostStates.Frightened)
  .toFrom(GhostStates.Paused);

ghostState
  .from(GhostStates.Frightened)
  .to(GhostStates.Eaten)
  .toFrom(GhostStates.Paused);

ghostState
  .from(GhostStates.Eaten)
  .to(GhostStates.Scatter)
  .to(GhostStates.Chasing)
  .toFrom(GhostStates.Paused);

ghostState.from(GhostStates.Paused);

ghostState
  .from(GhostStates.Frightened)
  .to(GhostStates.Eaten)
  .to(GhostStates.Paused);

ghostState.OnPreChange = (from: GhostStates, to: GhostStates): boolean => {
  console.log(`Attempting to change from ${from} to ${to}`);
  return true;
};

ghostState.OnPostChange = (from: GhostStates, to: GhostStates): boolean => {
  console.log(`We are going to change from ${from} to ${to}`);
  return true;
};

ghostState.debug();
console.log(ghostState.change(GhostStates.Eaten));
console.log(ghostState.change(GhostStates.Scatter));
