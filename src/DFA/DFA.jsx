export class DFA {
  constructor() {
    this.states = new Set();
    this.alphabet = new Set();
    this.transitions = {};
    this.startState = null;
    this.finalState = new Set();
  }

  addState(state) {
    this.states.add(state);
  }

  addAlphabet(symbol) {
    this.alphabet.add(symbol);
  }

  setStartState(state) {
    if (this.states.has(state)) {
      this.startState = state;
    } else {
      throw new Error(`State ${state} does not exist.`);
    }
  }

  setFinalState(state) {
    if (this.states.has(state)) {
      this.finalState.add(state);
    } else {
      throw new Error(`State ${state} does not exist.`);
    }
  }

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
