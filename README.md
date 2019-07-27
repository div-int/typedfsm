# typedfsm

[![CircleCI](https://circleci.com/gh/div-int/typedfsm/tree/develop.svg?style=svg)](https://circleci.com/gh/div-int/typedfsm/tree/develop)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/41db80e6747c4a0fb57d7968242d1b0a)](https://app.codacy.com/app/scottjmoore/typedfsm?utm_source=github.com&utm_medium=referral&utm_content=div-int/typedfsm&utm_campaign=Badge_Grade_Settings)
[![Coverage Status](https://coveralls.io/repos/github/div-int/typedfsm/badge.svg?branch=develop)](https://coveralls.io/github/div-int/typedfsm?branch=develop)

A TypeScript Finite State Machine library.

## Example

First create an enum with the different states. It can have text values

```typescript
const enum GhostStates {
  Waiting = 'Waiting',
  Chasing = 'Chasing',
  Scatter = 'Scatter',
  Frightened = 'Frightened',
  Eaten = 'Eaten',
  Paused = 'Paused',
}
```

or just a plain numeric enum.

```typescript
const enum GhostStates {
  Waiting,
  Chasing,
  Scatter,
  Frightened,
  Eaten,
  Paused,
}
```

To create the typed finite state machine use the following code with the previously defined enum and the start/default state of the machine as a parameter.

```typescript
const ghostState = new Typed.FSM<GhostStates>(GhostStates.Waiting);
```
To create states/transitions we first call the `from()` method on the `ghostState` object, this will create a state of `Waiting`.
To add a transition rule to this state we can chain the `to()` method to this call and give it the state `Chasing`.
This will allow us to go from `Waiting` to `Chasing` but not from `Chasing` to `Waiting`.
Next we call the `toFrom()` method which will create a transition rule to allow us to change from `Waiting` to `Paused` and from `Paused` back to `Waiting`.

```typescript
ghostState
  .from(GhostStates.Waiting)
  .to(GhostStates.Chasing)
  .toFrom(GhostStates.Paused);
```
