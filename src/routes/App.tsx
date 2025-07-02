import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Bgframe from "../bgframe";
import HomePage from "../Home";
import Dashboard from "../Dashboard/main";
import ProtectedRoute from "./protectedroute";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/create/"
            element={
              <ProtectedRoute>
                <Bgframe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
