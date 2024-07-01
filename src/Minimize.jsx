import React, { useEffect, useState } from "react";
import { DFA } from "./FA/DFA";
import { Graphviz } from "graphviz-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Minimize = () => {
  const location = useLocation();
  const data = location.state;
  const [originalDFA, setOriginalDFA] = useState(null);
  const [minimizedDFA, setMinimizedDFA] = useState(null);

  useEffect(() => {
    if (data) {
      const newAutomaton = new DFA();
      newAutomaton.states = new Set(data.states);
      newAutomaton.alphabet = new Set(data.alphabet);
      newAutomaton.transitions = data.transitions;
      newAutomaton.startState = data.startState;
      newAutomaton.finalState = new Set(data.finalState);

      setOriginalDFA(newAutomaton);
      console.log("Original Automaton: ", newAutomaton);

      // Minimize the DFA
      try {
        const minimized = newAutomaton.minimize();
        setMinimizedDFA(minimized);
        console.log("Minimized DFA: ", minimized);
      } catch (error) {
        console.error("Error during minimization: ", error);
      }
    }
  }, [data]);

  const renderGraphviz = (dfa) => {
    if (!dfa) return "";

    const dotString = `
      digraph {
        rankdir=LR;
        node [shape = point]; entry;
        node [shape = circle];

        entry -> "${dfa.startState}";

        ${[...dfa.states]
          .map(
            (state) =>
              `"${state}" [shape=${
                dfa.finalState.has(state) ? "doublecircle" : "circle"
              }]`
          )
          .join("\n")}
        ${Object.entries(dfa.transitions)
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
      {/* Before minimize */}
      <div>
        <h1 className="text-center " style={{ margin: "0" }}>
          Original DFA
        </h1>
        <div className="container d-flex justify-content-center align-items-center gap-4">
          <div className="container">
            {originalDFA && (
              <table className="table table-bordered table-striped  table-hover ">
                <thead>
                  <tr>
                    <th></th>
                    {[...originalDFA.alphabet].map((symbol, index) => (
                      <th key={index}>{symbol}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...originalDFA.states].map((state, index) => (
                    <tr key={index}>
                      <td>{state}</td>
                      {[...originalDFA.alphabet].map((symbol, symbolIndex) => (
                        <td key={symbolIndex}>
                          {originalDFA.transitions[state] &&
                          originalDFA.transitions[state][symbol]
                            ? originalDFA.transitions[state][symbol]
                            : "{∅}"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {originalDFA && <Graphviz dot={renderGraphviz(originalDFA)} />}
        </div>
      </div>

      {/* After minimize */}
      <div>
        <h1 className="text-center" style={{ margin: "0" }}>
          Minimized DFA
        </h1>
        <div className="container d-flex justify-content-center align-items-center gap-4">
          <div className="container">
            {minimizedDFA && (
              <table className="table table-bordered table-striped  table-hover ">
                <thead>
                  <tr>
                    <th></th>
                    {[...minimizedDFA.alphabet].map((symbol, index) => (
                      <th key={index}>{symbol}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...minimizedDFA.states].map((state, index) => (
                    <tr key={index}>
                      <td>{state}</td>
                      {[...minimizedDFA.alphabet].map((symbol, symbolIndex) => (
                        <td key={symbolIndex}>
                          {minimizedDFA.transitions[state] &&
                          minimizedDFA.transitions[state][symbol]
                            ? minimizedDFA.transitions[state][symbol]
                            : "{∅}"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {minimizedDFA && <Graphviz dot={renderGraphviz(minimizedDFA)} />}
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
export default Minimize;
