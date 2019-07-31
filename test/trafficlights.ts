import { Typed } from '../src/typedfsm';
import { expect } from 'chai';

export const enum TrafficLightsStates {
  Red = 'Waiting',
  Amber = 'Chasing',
  Green = 'Scatter',
  RedAmber = 'Red + Amber',
}

export const enum TrafficLightsActions {
  Change = 'Change',
  DoNothing = 'DoNothing',
}

const trafficLightState = new Typed.FSM<TrafficLightsStates, TrafficLightsActions>(TrafficLightsStates.Red);

trafficLightState.from(TrafficLightsStates.Red).to(TrafficLightsStates.RedAmber, TrafficLightsActions.Change);
trafficLightState.from(TrafficLightsStates.RedAmber).to(TrafficLightsStates.Green, TrafficLightsActions.Change);
trafficLightState.from(TrafficLightsStates.Green).to(TrafficLightsStates.Amber, TrafficLightsActions.Change);
trafficLightState.from(TrafficLightsStates.Amber).to(TrafficLightsStates.Red, TrafficLightsActions.Change);

describe('Test traffic light state machine.', () => {
  it('Is the current/default state red?', () => {
    trafficLightState.reset();
    expect(trafficLightState.currentState).to.equal(TrafficLightsStates.Red);
  });
});

describe('Change the traffic lights state.', () => {
  it('It should now be red and amber?', () => {
    trafficLightState.do(TrafficLightsActions.Change);
    expect(trafficLightState.currentState).to.equal(TrafficLightsStates.RedAmber);
  });

  it('It should now be green?', () => {
    trafficLightState.do(TrafficLightsActions.Change);
    expect(trafficLightState.currentState).to.equal(TrafficLightsStates.Green);
  });

  it('It should now be amber?', () => {
    trafficLightState.do(TrafficLightsActions.Change);
    expect(trafficLightState.currentState).to.equal(TrafficLightsStates.Amber);
  });

  it('It should now be red?', () => {
    trafficLightState.do(TrafficLightsActions.Change);
    expect(trafficLightState.currentState).to.equal(TrafficLightsStates.Red);
  });

  it('It should now be red and amber again?', () => {
    trafficLightState.do(TrafficLightsActions.Change);
    expect(trafficLightState.currentState).to.equal(TrafficLightsStates.RedAmber);
  });
});

describe('Do nothing to the traffic lights state.', () => {
  it('It should still be red and amber?', () => {
    trafficLightState.do(TrafficLightsActions.DoNothing);
    expect(trafficLightState.currentState).to.equal(TrafficLightsStates.RedAmber);
  });
});
