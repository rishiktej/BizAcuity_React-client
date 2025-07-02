import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Bgframe from "./bgframe";
import HomePage from "./Home";
import Dashboard from "./Dashboard/main";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<Bgframe />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
