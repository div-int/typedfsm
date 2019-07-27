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

// const ghostState = new Typed.FSM<GhostStates>(GhostStates.Waiting);

// ghostState
//   .from(GhostStates.Chasing)
//   .toFrom(GhostStates.Scatter)
//   .toFrom(GhostStates.Frightened)
//   .toFrom(GhostStates.Paused);

// ghostState
//   .from(GhostStates.Scatter)
//   .toFrom(GhostStates.Frightened)
//   .toFrom(GhostStates.Paused);

// ghostState
//   .from(GhostStates.Frightened)
//   .to(GhostStates.Eaten)
//   .toFrom(GhostStates.Paused);

// ghostState
//   .from(GhostStates.Eaten)
//   .to(GhostStates.Scatter)
//   .to(GhostStates.Chasing)
//   .toFrom(GhostStates.Paused);

// ghostState.from(GhostStates.Paused);

// ghostState
//   .from(GhostStates.Frightened)
//   .to(GhostStates.Eaten)
//   .to(GhostStates.Paused);

let ghostState: Typed.FSM<GhostStates>;

ghostState = new Typed.FSM<GhostStates>(GhostStates.Waiting);

describe('ghostState = new Typed.FSM<GhostStates>(GhostStates.Waiting)', () => {
  it('ghostState.currentState === GhostStates.Waiting', () => {
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
});

ghostState
  .from(GhostStates.Waiting)
  .to(GhostStates.Chasing)
  .toFrom(GhostStates.Paused);

describe('ghostState\n\t.from(GhostStates.Waiting)\n\t.to(GhostStates.Chasing)\n\t.toFrom(GhostStates.Paused);', () => {
  it('ghostState.change(GhostStates.Paused) === GhostStates.Paused', () => {
    ghostState.change(GhostStates.Paused);
    expect(ghostState.currentState).to.equal(GhostStates.Paused);
  });
  it('ghostState.change(GhostStates.Waiting) === GhostStates.Waiting)', () => {
    ghostState.change(GhostStates.Waiting);
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
  it('ghostState.change(GhostStates.Chasing) === GhostStates.Chasing', () => {
    ghostState.change(GhostStates.Chasing);
    expect(ghostState.currentState).to.equal(GhostStates.Chasing);
  });
  it('ghostState.reset() === GhostStates.Waiting', () => {
    ghostState.reset();
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
  it('ghostState.canChange(GhostStates.Frightened) === false', () => {
    const canChangeResult = ghostState.canChange(GhostStates.Frightened);
    expect(canChangeResult).to.equal(false);
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
