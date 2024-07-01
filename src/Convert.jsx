import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NFA } from "./FA/NFA";
import { Graphviz } from "graphviz-react";
import { Link } from "react-router-dom";

const Convert = () => {
  const location = useLocation();
  const data = location.state;
  const [originalNFA, setOriginalNFA] = useState(null);
  const [convertedDFA, setConvertedDFA] = useState(null);

  // Example handling in useEffect
  useEffect(() => {
    if (data) {
      const newAutomaton = new NFA();
      newAutomaton.states = new Set(data.states);
      newAutomaton.alphabet = new Set(data.alphabet);
      newAutomaton.transitions = data.transitions;
      newAutomaton.startState = data.startState;
      newAutomaton.finalState = new Set(data.finalState);

      setOriginalNFA(newAutomaton);
      try {
        const newDFA = newAutomaton.convertToDFA();
        console.log("After convert:", newDFA);
        setConvertedDFA(newDFA);
      } catch (error) {
        console.error("Error during conversion: ", error);
      }
    }
  }, [data]);

  const renderGraphviz = (automaton, type) => {
    if (!automaton) return "";

    const dotString = `
      digraph {
        rankdir=LR;
        node [shape = point]; entry;
        node [shape = circle];
  
        entry -> "${automaton.startState}";
  
        ${[...automaton.states]
          .map(
            (state) =>
              `"${state}" [shape=${
                automaton.finalState.has(state) ? "doublecircle" : "circle"
              }]`
          )
          .join("\n")}
        ${Object.entries(automaton.transitions)
          .map(([currentState, transitions]) =>
            Object.entries(transitions)
              .map(([inputSymbol, nextStates]) =>
                // Check if nextStates is an object and convert to array if necessary
                Array.isArray(nextStates)
                  ? nextStates
                      .map(
                        (nextState) =>
                          `"${currentState}" -> "${nextState}" [label="${inputSymbol}"]`
                      )
                      .join("\n")
                  : Array.from(nextStates)
                      .map(
                        (nextState) =>
                          `"${currentState}" -> "${nextState}" [label="${inputSymbol}"]`
                      )
                      .join("\n")
              )
              .join("\n")
          )
          .join("\n")}
      }
    `;
    // console.log(dotString); // Output DOT string to console for debugging
    return dotString;
  };

  // Render for DFA
  const renderGraphvizDFA = (automaton) => {
    if (!automaton) return "";

    const dotString = `
      digraph {
        rankdir=LR;
        node [shape = point]; entry;
        node [shape = circle];
  
        entry -> "${automaton.startState}";
  
        ${[...automaton.states]
          .map(
            (state) =>
              `"${state}" [shape=${
                automaton.finalState.has(state) ? "doublecircle" : "circle"
              }]`
          )
          .join("\n")}
        ${Object.entries(automaton.transitions)
          .map(([currentState, transitions]) =>
            Object.entries(transitions)
              .map(
                ([inputSymbol, nextState]) =>
                  `"${currentState}" -> "${nextState}" [label="${inputSymbol}"]`
              )
              .join("\n")
          )
          .join("\n")}
      }
    `;

    return dotString;
  };

  return (
    <div className="container-fluid">
      {/* Original NFA */}
      <div>
        <h1 className="text-center" style={{ margin: "0" }}>
          Original NFA
          {console.log("NFA : ", originalNFA)}
        </h1>
        <div className="container d-flex justify-content-center align-items-center gap-4">
          <div className="container">
            {originalNFA && (
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th></th>
                    {[...originalNFA.alphabet].map((symbol, index) => (
                      <th key={index}>{symbol}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...originalNFA.states].map((state, index) => (
                    <tr key={index}>
                      <td>{state}</td>
                      {[...originalNFA.alphabet].map((symbol, symbolIndex) => (
                        <td key={symbolIndex}>
                          {originalNFA.transitions[state] &&
                          originalNFA.transitions[state][symbol]
                            ? Array.isArray(
                                originalNFA.transitions[state][symbol]
                              )
                              ? originalNFA.transitions[state][symbol].join(
                                  ", "
                                )
                              : originalNFA.transitions[state][symbol]
                            : "{∅}"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {originalNFA && <Graphviz dot={renderGraphviz(originalNFA, "NFA")} />}
        </div>
      </div>

      {/* Converted DFA */}
      <div>
        <h1 className="text-center" style={{ margin: "0" }}>
          Converted DFA
        </h1>
        <div className="container d-flex justify-content-center align-items-center gap-4">
          <div className="container">
            {convertedDFA && (
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th></th>
                    {[...convertedDFA.alphabet].map((symbol, index) => (
                      <th key={index}>{symbol}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...convertedDFA.states].map((state, index) => (
                    <tr key={index}>
                      <td>{state}</td>
                      {[...convertedDFA.alphabet].map((symbol, symbolIndex) => (
                        <td key={symbolIndex}>
                          {convertedDFA.transitions[state] &&
                          convertedDFA.transitions[state][symbol]
                            ? convertedDFA.transitions[state][symbol]
                            : "{∅}"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {convertedDFA && <Graphviz dot={renderGraphvizDFA(convertedDFA)} />}
        </div>
        <div className="container">
          <Link
            to="/"
            className="btn btn-primary"
            style={{ marginBottom: "20px" }}
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Convert;
