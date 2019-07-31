import { Typed } from '../src/typedfsm';
import { expect } from 'chai';

namespace TrafficLights {
  export const enum States {
    Red = 'Waiting',
    Amber = 'Chasing',
    Green = 'Scatter',
    RedAmber = 'Red + Amber',
  }

  export const enum Actions {
    Change = 'Change',
    DoNothing = 'DoNothing',
  }

  const trafficLightState = new Typed.FSM<States, Actions>(States.Red);

  trafficLightState.from(States.Red).to(States.RedAmber, Actions.Change);
  trafficLightState.from(States.RedAmber).to(States.Green, Actions.Change);
  trafficLightState.from(States.Green).to(States.Amber, Actions.Change);
  trafficLightState.from(States.Amber).to(States.Red, Actions.Change);

  describe('Test traffic light state machine.', () => {
    it('Is the current/default state red?', () => {
      trafficLightState.reset();
      expect(trafficLightState.currentState).to.equal(States.Red);
    });
  });

  describe('Change the traffic lights state.', () => {
    it('It should now be red and amber?', () => {
      trafficLightState.do(Actions.Change);
      expect(trafficLightState.currentState).to.equal(States.RedAmber);
    });

    it('It should now be green?', () => {
      trafficLightState.do(Actions.Change);
      expect(trafficLightState.currentState).to.equal(States.Green);
    });

    it('It should now be amber?', () => {
      trafficLightState.do(Actions.Change);
      expect(trafficLightState.currentState).to.equal(States.Amber);
    });

    it('It should now be red?', () => {
      trafficLightState.do(Actions.Change);
      expect(trafficLightState.currentState).to.equal(States.Red);
    });

    it('It should now be red and amber again?', () => {
      trafficLightState.do(Actions.Change);
      expect(trafficLightState.currentState).to.equal(States.RedAmber);
    });
  });

  describe('Do nothing to the traffic lights state.', () => {
    it('It should still be red and amber?', () => {
      trafficLightState.do(Actions.DoNothing);
      expect(trafficLightState.currentState).to.equal(States.RedAmber);
    });
  });
}
