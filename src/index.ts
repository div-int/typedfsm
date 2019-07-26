import { Typed } from './typedfsm';

// const enum GhostStates {
//   Waiting,
//   Chasing,
//   Scatter,
//   Frightened,
//   Eaten,
//   Paused,
// }

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
  .to(GhostStates.Scatter)
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
