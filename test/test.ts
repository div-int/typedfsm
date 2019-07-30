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
  Chase= 'Chase',
  Scatter = 'Scatter',
  Frighten = 'Frighten',
  Eat = 'Eat',
  Pause = 'Pause',
}

let ghostState: Typed.FSM<GhostStates, GhostActions>;
let resultOnPreChange: string;
let resultOnPostChange: string;

describe('Create ghost state with default state of waiting.', () => {
  ghostState = new Typed.FSM<GhostStates, GhostActions>(GhostStates.Waiting);

  it('Is current state waiting?', (done) => {
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
    done();
  });
});

describe('Create state of waiting going to chasing and to/from paused.', () => {
  ghostState
    .from(GhostStates.Waiting)
    .to(GhostStates.Chasing, GhostActions.Chase)
    .toFrom(GhostStates.Paused, GhostActions.Pause, GhostActions.Wait);

  it('Can change state to paused?', () => {
    ghostState.change(GhostStates.Paused);
    expect(ghostState.currentState).to.equal(GhostStates.Paused);
  });
  it('Can change state to waiting?', () => {
    ghostState.change(GhostStates.Waiting);
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
  it('Can change state to chasing?', () => {
    ghostState.change(GhostStates.Chasing);
    expect(ghostState.currentState).to.equal(GhostStates.Chasing);
  });
  it("Can't change state to frightened? ", () => {
    const canChangeResult = ghostState.canChange(GhostStates.Frightened);
    expect(canChangeResult).to.equal(false);
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
  it('Can perform action chase?', () => {
    ghostState.do(GhostActions.Chase);
    expect(ghostState.currentState).to.equal(GhostStates.Chasing);
  });
  it('Can perform action wait?', () => {
    ghostState.do(GhostActions.Wait);
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
  it("Can't perform action frighten? ", () => {
    const canChangeResult = ghostState.canDo(GhostActions.Frighten);
    expect(canChangeResult).to.equal(false);
  });

  it('Does resetting change state to waiting?', () => {
    ghostState.reset();
    expect(ghostState.currentState).to.equal(GhostStates.Waiting);
  });
});

ghostState.reset();
console.log(ghostState.findAction(GhostStates.Waiting, GhostActions.Pause));

// describe('ghostState.OnPreChange = (from: GhostStates, to: GhostStates)', () => {
//   ghostState.OnPreChange = (from: GhostStates, to: GhostStates): boolean => {
//     resultOnPreChange = `${from} ===> ${to}`;
//     return true;
//   };

//   it('resultOnPreChange === "Waiting ===> Chasing"', () => {
//     expect(resultOnPreChange).to.equal('Waiting ===> Chasing');
//   });
// });

// describe('ghostState.OnPostChange = (from: GhostStates, to: GhostStates)', () => {
//   ghostState.OnPostChange = (from: GhostStates, to: GhostStates): boolean => {
//     resultOnPostChange = `${from} ===> ${to}`;
//     return true;
//   };

//   it('resultOnPostChange === "Waiting ===> Chasing"', () => {
//     expect(resultOnPostChange).to.equal('Waiting ===> Chasing');
//   });
// });

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

// console.log(ghostState.currentState);
// console.log(ghostState.change(GhostStates.Paused));
// console.log(ghostState.change(GhostStates.Waiting));
