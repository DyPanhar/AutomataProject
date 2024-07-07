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

  getReachableStates(initialState) {
    const reachable = new Set([initialState]);
    const stack = [initialState];

    while (stack.length > 0) {
      const state = stack.pop();
      for (const symbol of this.alphabet) {
        const nextState = this.transitions[state]?.[symbol];
        if (nextState && !reachable.has(nextState)) {
          reachable.add(nextState);
          stack.push(nextState);
        }
      }
    }

    return reachable;
  }

  partitionStates(reachableStates) {
    // Initialize partitions with final and non-final states
    let partitions = [
      new Set(this.finalState),
      new Set(
        [...reachableStates].filter((state) => !this.finalState.has(state))
      ),
    ];

    console.log("Initialize partitions:", partitions);

    let changed = true;
    while (changed) {
      changed = false;
      const newPartitions = [];

      for (const partition of partitions) {
        const blocks = this.splitPartition(
          partition,
          partitions,
          reachableStates
        );
        newPartitions.push(...blocks);
        if (blocks.length > 1) {
          changed = true;
        }
      }

      partitions = newPartitions;
      console.log("New partitions:", partitions);
    }

    console.log("Final partitions:", partitions);
    return partitions;
  }

  splitPartition(partition, partitions, reachableStates) {
    const blocks = {};

    for (const state of partition) {
      if (!reachableStates.has(state)) {
        // Skip unreachable states in partitioning
        continue;
      }

      const signature = this.getStateSignature(state);

      if (!(signature in blocks)) {
        blocks[signature] = new Set();
      }
      blocks[signature].add(state);
    }

    return Object.values(blocks);
  }

  getStateSignature(state) {
    const transitions = [];

    // Collect transitions for the current state
    for (const symbol of this.alphabet) {
      const nextState = this.transitions[state]?.[symbol] || null;
      transitions.push(nextState);
    }

    return transitions.join(",");
  }

  constructMinimizedDFA(partitions) {
    const newDFA = new DFA();

    // Sorting partitions lexicographically
    const sortedPartitions = partitions
      .map((partition) => [...partition])
      .sort((a, b) => {
        const stateStrA = a.sort().join("");
        const stateStrB = b.sort().join("");
        return stateStrA.localeCompare(stateStrB);
      });

    console.log("Sorted Partitions: ", sortedPartitions);

    // Add states to newDFA based on sorted partitions
    sortedPartitions.forEach((partition, index) => {
      const representative = [...partition][0];
      const newState = `q${index}`;
      newDFA.addState(newState);

      // Set start state and final states in the minimized DFA
      if (this.finalState.has(representative)) {
        newDFA.setFinalState(newState);
      }
      if (this.startState === representative) {
        newDFA.setStartState(newState);
      }
    });

    // Add the alphabet to the new DFA
    this.alphabet.forEach((symbol) => {
      newDFA.addAlphabet(symbol);
    });

    // Process each partition to add transitions to the minimized DFA
    sortedPartitions.forEach((partition) => {
      const representative = [...partition][0];
      const newState = `q${sortedPartitions.findIndex((p) =>
        p.includes(representative)
      )}`;

      // Process each symbol in the alphabet
      this.alphabet.forEach((symbol) => {
        const nextState = this.transitions[representative]?.[symbol];

        // Log transition processing details
        console.log("Processing transition: ", {
          representative,
          symbol,
          nextState,
        });

        // Check if next state is defined in the original DFA transitions
        if (nextState !== undefined) {
          const mappedNextState = `q${sortedPartitions.findIndex((p) =>
            p.includes(nextState)
          )}`;
          if (mappedNextState === undefined) {
            console.error(
              `Undefined nextState for ${representative} on ${symbol}`
            );
          } else {
            // Add transition to the minimized DFA
            newDFA.addTransition(newState, symbol, mappedNextState);
          }
        } else {
          // Handle case where no transition is defined for a symbol
          console.warn(
            `No transition defined for ${representative} on ${symbol}`
          );
        }
      });
    });

    console.log("Minimized DFA: ", newDFA);
    return newDFA;
  }

  minimize() {
    const reachableStates = this.getReachableStates(this.startState);
    const partitions = this.partitionStates(reachableStates);
    const minimizedDFA = this.constructMinimizedDFA(partitions);
    return minimizedDFA;
  }
}
