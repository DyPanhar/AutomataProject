import React, { useEffect } from "react";
import { DFA } from "./FA/DFA";
import { Graphviz } from "graphviz-react";
import { useLocation } from "react-router-dom";
const Minimize = () => {
  const location = useLocation();
  const data = location.state;

  console.log(data);
  const newAutomaton = new DFA();
  // Object.assign(newAutomaton, data);
  const minimize = newAutomaton.minimize();
  console.log(minimize);
};

export default Minimize;
