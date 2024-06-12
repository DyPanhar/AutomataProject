import React from "react";
import { useState, useEffect } from "react";
import { DFA } from "./DFA";
import { Graphviz } from "graphviz-react";
const Index = () => {
  const [numState, setNumState] = useState(0);
  const [states, setStates] = useState([]);
  const [alphabet, setAlphabet] = useState([]);
  const [startState, setStartState] = useState("");
  const [finalState, setFinalState] = useState("");
  const [numTransitions, setNumTransitions] = useState(0);
  const [transitions, setTransitions] = useState([]);
  const [inputString, setInputString] = useState("");
  const [isAccepted, setIsAccepted] = useState(null);
  const [dfa, setDfa] = useState(new DFA());

  useEffect(() => {
    if (states.length > 0) {
      setStartState(states[0]);
      setFinalState(states[states.length - 1]);
    }
  }, [states]);

  const handleNumState = (numState) => {
    const num = parseInt(numState);
    setNumState(num);
    const newStates = Array.from({ length: num }, (_, i) => `q${i}`);
    setStates(newStates);
    // console.log(startState);
  };

  const handleAlphabet = (syn) => {
    setAlphabet(syn);
  };

  const handleNumTransitions = (e) => {
    const num = parseInt(e.target.value);
    setNumTransitions(num);
    setTransitions(
      Array(num).fill({ currentState: "", inputSymbol: "", nextState: "" })
    );
  };

  const handleTransitions = (inx, field, val) => {
    const newTransitions = [...transitions];
    newTransitions[inx] = { ...newTransitions[inx], [field]: val };
    setTransitions(newTransitions);
  };

  const handleProcessInput = (e) => {
    e.preventDefault();
    const result = dfa.processInput(inputString);
    setIsAccepted(result);
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const newDfa = new DFA();
    states.forEach((state) => newDfa.addState(state));
    const sortAlphabet = alphabet.sort();
    sortAlphabet.forEach((syn) => newDfa.addAlphabet(syn.trim()));
    newDfa.setStartState(startState);
    const sortedFinalStates = finalState.split(",").sort();
    sortedFinalStates.forEach((finalState) =>
      newDfa.setFinalState(finalState.trim())
    );

    transitions.forEach((transition) => {
      newDfa.addTransition(
        transition.currentState,
        transition.inputSymbol,
        transition.nextState
      );
    });

    setDfa(newDfa);
    console.log(newDfa.transitions.q0[0]);
  };
  const renderGraphviz = () => {
    const dotString = `
      digraph {
        rankdir=LR;
        node [shape = point]; entry;
        node [shape = circle];

        entry -> "${startState}";

        ${states
          .map(
            (state) =>
              `"${state}" [shape=${
                finalState.includes(state) ? "doublecircle" : "circle"
              }]`
          )
          .join("\n")}
        ${transitions
          .map(
            ({ currentState, inputSymbol, nextState }) =>
              `"${currentState}" -> "${nextState}" [label="${inputSymbol}"]`
          )
          .join("\n")}
      }
    `;
    return dotString;
  };

  return (
    <>
      <h1 className="text-center mb-5">DFA Design</h1>
      <div className="container d-flex gap-5">
        <form onSubmit={handlesubmit} className="form-container">
          <div className="mb-3">
            <label>State : </label>
            <input
              type="number"
              min={0}
              value={numState}
              onChange={(e) => handleNumState(e.target.value)}
            />
          </div>
          <div className="mb-3">
            Alphabet (comma separated):
            <input
              type="text"
              value={alphabet}
              onChange={(e) => handleAlphabet(e.target.value.split(","))}
            />
          </div>
          <div className="mb-3">
            Choose Start State :
            <select
              name="startState"
              value={startState}
              onChange={(e) => setStartState(e.target.value)}
            >
              <option value="">Select State</option>
              {states.map((val, inx) => (
                <option value={val} key={inx}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            Choose Final State :
            <input
              type="text"
              value={finalState}
              onChange={(e) => setFinalState(e.target.value)}
            />
          </div>
          <div className="mb-3">
            Transition :
            <input
              type="number"
              value={numTransitions}
              onChange={handleNumTransitions}
              min={0}
            />
          </div>
          {transitions.map((_, index) => (
            <div key={index} className="container">
              <label>Transition {index + 1} :</label>
              <select
                value={transitions[index].currentState}
                onChange={(e) =>
                  handleTransitions(index, "currentState", e.target.value)
                }
              >
                <option>Select State</option>
                {states.map((state, inx) => (
                  <option value={state} key={inx}>
                    {state}
                  </option>
                ))}
              </select>
              <select
                value={transitions[index].inputSymbol}
                onChange={(e) =>
                  handleTransitions(index, "inputSymbol", e.target.value)
                }
                className="mx-2"
              >
                <option>Select Alphabet</option>
                {alphabet.map((symbol, inx) => (
                  <option value={symbol} key={inx}>
                    {symbol}
                  </option>
                ))}
              </select>
              <select
                value={transitions[index].nextState}
                onChange={(e) =>
                  handleTransitions(index, "nextState", e.target.value)
                }
              >
                <option>Select Next State</option>
                {states.map((state, inx) => (
                  <option value={state} key={inx}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            type="submit"
            className="border border-success rounded-2 mt-4"
          >
            Submit
          </button>
        </form>
        <div className=" d-flex flex-column align-items-center justify-content-center">
          <div className="container">
            <h2 className="text-center">Process Input String</h2>
            <form onSubmit={handleProcessInput} className="d-flex my-2">
              <input
                type="text"
                placeholder="Enter input string"
                value={inputString}
                onChange={(e) => setInputString(e.target.value)}
                className="float-start"
              />
              <button type="submit" className="rounded-2 float-end mx-1">
                Process
              </button>
            </form>
            {isAccepted != null && isAccepted ? (
              <p className="text-success">The input string is accepted</p>
            ) : (
              isAccepted != null && (
                <p className="text-danger">The input string is rejected.</p>
              )
            )}
          </div>

          <div style={{ width: "250px" }}>
            <Graphviz dot={renderGraphviz()} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
