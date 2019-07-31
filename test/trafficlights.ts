import { Typed } from '../src/typedfsm';
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

describe('Do nothing to the traffic lights state.', () => {
  it('It should still be red and amber?', () => {
    trafficLightState.do(TLActions.DoNothing);
    expect(trafficLightState.currentState).to.equal(TLStates.RedAmber);
  });
});
