export class FA {
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
      (this.alphabet.has(inputSymbol) || inputSymbol === "ε")
    ) {
      if (!this.transitions[currentState]) {
        this.transitions[currentState] = {};
      }
      if (!this.transitions[currentState][inputSymbol]) {
        this.transitions[currentState][inputSymbol] = new Set();
      }
      this.transitions[currentState][inputSymbol]?.add(nextState);
    } else {
      throw new Error(
        `Invalid transition: ${currentState} --(${inputSymbol})--> ${nextState}`
      );
    }
  }

  CheckFA() {
    for (const state of this.states) {
      for (const symbol of this.alphabet) {
        const newTransitions = this.transitions[state]?.[symbol];
        const sizeCheck = newTransitions?.size || 0;
        if (newTransitions && sizeCheck > 1) {
          return "NFA";
        }
      }
      if (this.transitions[state]?.["ε"]) {
        return "NFA";
      }
    }
    return "DFA";
  }
}
