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

ghostState
  .from(GhostStates.Waiting)
  .to(GhostStates.Chasing)
  .toFrom(GhostStates.Paused);

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

describe('const ghostState = new Typed.FSM<GhostStates>(GhostStates.Waiting);', () => {
  it('Create GhostState FSM', () => {
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
});

describe('[Paused] <==> [Waiting] ==> [Chasing]', () => {
  it('Change state [Waiting] ==> [Paused]', () => {
    ghostState.change(GhostStates.Paused);
    expect(ghostState.currentState).to.equal(GhostStates.Paused);
  });
  it('Change state [Waiting] <== [Paused]', () => {
    ghostState.change(GhostStates.Waiting);
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
  it('Change state [Waiting] ==> [Chasing]', () => {
    ghostState.change(GhostStates.Chasing);
    expect(ghostState.currentState).to.equal(GhostStates.Chasing);
  });
  it("Don't change state [Waiting] ==> [Scatter]", () => {
    ghostState.reset();
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
});

// ghostState.OnPreChange = (from: GhostStates, to: GhostStates): boolean => {
//   console.log(`Attempting to change from ${from} to ${to}`);
//   return true;
// };

// ghostState.OnPostChange = (from: GhostStates, to: GhostStates): boolean => {
//   console.log(`We are going to change from ${from} to ${to}`);
//   return true;
// };

// console.log(ghostState.currentState);
// console.log(ghostState.change(GhostStates.Paused));
// console.log(ghostState.change(GhostStates.Waiting));
