import { Typed } from './typedfsm';

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
  .to(GhostStates.Chasing)
  .to(GhostStates.Scatter)
  .toFrom(GhostStates.Paused);

ghostState.from(GhostStates.Paused);

ghostState
  .from(GhostStates.Frightened)
  .to(GhostStates.Eaten)
  .to(GhostStates.Paused);

console.log(`Current ghost state = ${ghostState.currentState}`);

ghostState.debug();
