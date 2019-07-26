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
  .from(GhostStates.Waiting, 'Wait')
  .to(GhostStates.Chasing, 'Chase')
  .toFrom(GhostStates.Paused, 'Pause');

// ghostState
//   .from(GhostStates.Chasing, 'Chase')
//   .toFrom(GhostStates.Scatter, 'Scatter')
//   .toFrom(GhostStates.Frightened, 'Frighten')
//   .toFrom(GhostStates.Paused, 'Pause');

// ghostState
//   .from(GhostStates.Scatter, 'Scatter')
//   .toFrom(GhostStates.Frightened, 'Frighten')
//   .toFrom(GhostStates.Paused, 'Pause');

// ghostState
//   .from(GhostStates.Frightened, 'Frighten')
//   .to(GhostStates.Eaten, 'Eaten')
//   .toFrom(GhostStates.Paused, 'Pause');

// ghostState
//   .from(GhostStates.Eaten, 'Eaten')
//   .to(GhostStates.Scatter, 'Scatter')
//   .to(GhostStates.Chasing, 'Chase')
//   .toFrom(GhostStates.Paused, 'Pause');

// ghostState.from(GhostStates.Paused, 'Pause');

// ghostState
//   .from(GhostStates.Frightened, 'Frighten')
//   .to(GhostStates.Eaten, 'Eat')
//   .to(GhostStates.Paused, 'Pause');

console.log(`Current ghost state = ${ghostState.currentState}`);

ghostState.debug();
