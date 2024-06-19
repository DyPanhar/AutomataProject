import { FA } from "./FA";
export class DFA extends FA {
  addTransition(currentState, inputSymbol, nextState) {
    if (
      this.states.has(currentState) &&
      this.states.has(nextState) &&
      this.alphabet.has(inputSymbol)
    ) {
      if (!this.transitions[currentState]) {
        this.transitions[currentState] = {};
      }
      this.transitions[currentState][inputSymbol] = nextState;
    } else {
      throw new Error(
        `Invalid transition: ${currentState} --(${inputSymbol})--> ${nextState}`
      );
    }
  }

  processInput(input) {
    let currentState = this.startState;
    for (const symbol of input) {
      if (
        this.transitions[currentState] &&
        this.transitions[currentState][symbol]
      ) {
        currentState = this.transitions[currentState][symbol];
      } else {
        return false;
      }
    }
    return this.finalState.has(currentState);
  }
}
