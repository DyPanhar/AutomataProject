import { FA } from "./FA";

export class NFA extends FA {
  getEpsilonClosure(states) {
    const stack = [...states];
    const closure = new Set(states);
    while (stack.length > 0) {
      const state = stack.pop();
      const epsilonTransitions = this.transitions[state]?.["ε"] || [];
      for (const nextState of epsilonTransitions) {
        if (!closure.has(nextState)) {
          closure.add(nextState);
          stack.push(nextState);
        }
      }
    }
    return closure;
  }

  processInput(input) {
    let currentStates = this.getEpsilonClosure([this.startState]);
    for (const symbol of input) {
      const nextStates = new Set();
      for (const state of currentStates) {
        const symbolTransitions = this.transitions[state]?.[symbol] || [];
        for (const nextState of symbolTransitions) {
          nextStates.add(nextState);
        }
      }
      currentStates = this.getEpsilonClosure(nextStates);
    }
    for (const state of currentStates) {
      if (this.finalState.has(state)) {
        return true;
      }
    }
    return false;
  }
}
