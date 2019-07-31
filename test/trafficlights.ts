import { Typed } from '../../typedfsm';
import { expect } from 'chai';

const enum TLStates {
  Red = 'Waiting',
  Amber = 'Chasing',
  Green = 'Scatter',
  RedAmber = 'Red + Amber',
}

const enum TLActions {
  Change = 'Change',
  DoNothing = 'DoNothing',
}

const trafficLightState = new Typed.FSM<TLStates, TLActions>(TLStates.Red);

trafficLightState
  .from(TLStates.Red, TLActions.Change)
  .to(TLStates.RedAmber, TLActions.Change);
trafficLightState.from(TLStates.RedAmber).to(TLStates.Green, TLActions.Change);
trafficLightState.from(TLStates.Green).to(TLStates.Amber, TLActions.Change);
trafficLightState.from(TLStates.Amber).to(TLStates.Red, TLActions.Change);

describe('Test traffic light state machine.', () => {
  it('Is the current/default state red?', () => {
    trafficLightState.reset();
    expect(trafficLightState.currentState).to.equal(TLStates.Red);
  });
});

describe('Change the traffic lights state.', () => {
  it('It should now be red and amber?', () => {
    trafficLightState.do(TLActions.Change);
    expect(trafficLightState.currentState).to.equal(TLStates.RedAmber);
  });

  it('It should now be green?', () => {
    trafficLightState.do(TLActions.Change);
    expect(trafficLightState.currentState).to.equal(TLStates.Green);
  });

  it('It should now be amber?', () => {
    trafficLightState.do(TLActions.Change);
    expect(trafficLightState.currentState).to.equal(TLStates.Amber);
  });

  it('It should now be red?', () => {
    trafficLightState.do(TLActions.Change);
    expect(trafficLightState.currentState).to.equal(TLStates.Red);
  });

  it('It should now be red and amber again?', () => {
    trafficLightState.do(TLActions.Change);
    expect(trafficLightState.currentState).to.equal(TLStates.RedAmber);
  });
});

//   it('Can change state to waiting?', () => {
//     ghostState.change(GhostStates.Waiting);
//     expect(ghostState.currentState).to.equal(GhostStates.Waiting);
//   });

//   it("Can't change state to frightened? ", () => {
//     const canChangeResult = ghostState.canChange(GhostStates.Frightened);
//     expect(canChangeResult).to.equal(false);
//   });

//   it('Can change state to chasing?', () => {
//     ghostState.change(GhostStates.Chasing);
//     expect(ghostState.currentState).to.equal(GhostStates.Chasing);
//   });

//   it('Can change state back to paused?', () => {
//     ghostState.change(GhostStates.Paused);
//     expect(ghostState.currentState).to.equal(GhostStates.Paused);
//   });

//   it('Can perform action pause?', () => {
//     ghostState.reset();
//     ghostState.do(GhostActions.Pause);
//     expect(ghostState.currentState).to.equal(GhostStates.Paused);
//   });

//   it('Can perform action wait?', () => {
//     ghostState.do(GhostActions.Wait);
//     expect(ghostState.currentState).to.equal(GhostStates.Waiting);
//   });

//   it("Can't perform action frighten? ", () => {
//     const canChangeResult = ghostState.canDo(GhostActions.Frighten);
//     expect(canChangeResult).to.equal(false);
//   });

//   it('Can perform action chase?', () => {
//     ghostState.do(GhostActions.Chase);
//     expect(ghostState.currentState).to.equal(GhostStates.Chasing);
//   });

//   it('Can perform action pause?', () => {
//     ghostState.do(GhostActions.Pause);
//     expect(ghostState.currentState).to.equal(GhostStates.Paused);
//   });

//   it('Does resetting change state to waiting?', () => {
//     ghostState.reset();
//     expect(ghostState.currentState).to.equal(GhostStates.Waiting);
//   });
// });

// let resultOnPostChange: string;

// describe('Create on pre change state callback.', () => {
//   it('Should be same state if we cancel it? (change)', () => {
//     ghostState.OnPreChange = (
//       from: GhostStates,
//       to: GhostStates,
//       action: GhostActions,
//     ): boolean => {
//       return false;
//     };

//     ghostState.reset();
//     ghostState.change(GhostStates.Chasing);
//     expect(ghostState.currentState).to.equal(GhostStates.Waiting);
//   });

//   it("Should be chasing if we don't cancel it? (change)", () => {
//     ghostState.OnPreChange = (
//       from: GhostStates,
//       to: GhostStates,
//       action: GhostActions,
//     ): boolean => {
//       return true;
//     };

//     ghostState.reset();
//     ghostState.change(GhostStates.Chasing);
//     expect(ghostState.currentState).to.equal(GhostStates.Chasing);
//   });

//   it('Should be same state if we cancel it? (do)', () => {
//     ghostState.OnPreChange = (
//       from: GhostStates,
//       to: GhostStates,
//       action: GhostActions,
//     ): boolean => {
//       return false;
//     };

//     ghostState.reset();
//     ghostState.do(GhostActions.Chase);
//     expect(ghostState.currentState).to.equal(GhostStates.Waiting);
//   });

//   it("Should be chasing if we don't cancel it? (do)", () => {
//     ghostState.OnPreChange = (
//       from: GhostStates,
//       to: GhostStates,
//       action: GhostActions,
//     ): boolean => {
//       return true;
//     };

//     ghostState.reset();
//     ghostState.do(GhostActions.Chase);
//     expect(ghostState.currentState).to.equal(GhostStates.Chasing);
//   });
// });

// describe('Create on post change state callback.', () => {
//   it('Should be scatter after callback? (change)', () => {
//     ghostState.OnPostChange = (
//       from: GhostStates,
//       to: GhostStates,
//       action: GhostActions,
//     ): void => {
//       resultOnPostChange = `${from} ===> ${to} do ${action}`;
//     };

//     ghostState.reset();
//     ghostState.change(GhostStates.Scatter);
//     expect(ghostState.currentState).to.equal(GhostStates.Scatter);
//   });

//   it('Should be scatter after callback? (do)', () => {
//     ghostState.OnPostChange = (
//       from: GhostStates,
//       to: GhostStates,
//       action: GhostActions,
//     ): void => {
//       resultOnPostChange = `${from} ===> ${to} do ${action}`;
//     };

//     ghostState.reset();
//     ghostState.do(GhostActions.Scatter);
//     expect(ghostState.currentState).to.equal(GhostStates.Scatter);
//   });
// });

// describe('Check if we can perform invalid actions or state changes.', () => {
//   it('Should return an error if given invalid action? (do)', () => {
//     ghostState.reset();
//     const result = ghostState.do(GhostActions.Eat);
//     expect(result instanceof Error).to.equal(true);
//   });

//   it('Should return an error if given invalid state? (change)', () => {
//     ghostState.reset();
//     const result = ghostState.change(GhostStates.Eaten);
//     expect(result instanceof Error).to.equal(true);
//   });
// });
