import React from "react";
import "./App.css";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <div className="container">
      <h1 className="mb-5">Automata Menu</h1>
      <div className="container text-center d-flex flex-column gap-5">
        <Link to="/design-dfa" className="ch-container">
          Design FA
        </Link>
        <Link to="/convert-nfa-to-dfa" className="ch-container">
          Convert NFA to DFA
        </Link>
        <Link to="/minimizeDFA" className="ch-container">
          Minimize DFA
        </Link>
      </div>
    </div>
  );
};

export default Menu;
