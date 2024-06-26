import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Index from ".";
// import Menu from "./Menu";
import Minimize from "./Minimize";
import Convert from "./Convert";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Menu />} /> */}
        <Route path="/" element={<Index />} />
        <Route path="/minimizeDFA" element={<Minimize />} />
        <Route path="/NFAtoDFA" element={<Convert />} />
      </Routes>
    </Router>
  );
};

export default App;
