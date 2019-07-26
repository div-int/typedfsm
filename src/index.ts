import { Typed } from './typedfsm';

const enum GhostStates {
  Waiting,
  Chasing,
  Scatter,
  Frightened,
  Eaten,
  Paused,
}

let ghostState = new Typed.FSM<GhostStates>(GhostStates.Waiting);

ghostState
  .add(GhostStates.Waiting)
  .to(GhostStates.Chasing)
  .toFrom(GhostStates.Paused);

ghostState
  .add(GhostStates.Chasing)
  .to(GhostStates.Scatter)
  .to(GhostStates.Frightened)
  .to(GhostStates.Paused);

ghostState
  .add(GhostStates.Scatter)
  .to(GhostStates.Frightened)
  .to(GhostStates.Paused);

ghostState
  .add(GhostStates.Frightened)
  .to(GhostStates.Eaten)
  .to(GhostStates.Paused);

ghostState.add(GhostStates.Eaten).to(GhostStates.Paused);

ghostState.add(GhostStates.Paused);

ghostState
  .add(GhostStates.Frightened)
  .to(GhostStates.Eaten)
  .to(GhostStates.Paused);

console.log(`Current ghost state = ${ghostState.currentState}`);

ghostState.debug();
