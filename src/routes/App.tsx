import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Bgframe from "../bgframe";
import HomePage from "../Home";
import Dashboard from "../Dashboard/main";
import ProtectedRoute from "./protectedroute";
import Profile from "../Dashboard/profile";
import ForgotPass from "../Authentication/forgotpass";
import AdminSignUpForm from "../Authentication/admin/signup";
import AdminSignInForm from "../Authentication/admin/signin";
import AdminDashboard from "../Dashboard/admin/main";
import AdminUsersPage from "../Dashboard/admin/allusers";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/signup" element={<AdminSignUpForm />} />
          <Route path="/admin/signin" element={<AdminSignInForm />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/userslist" element={<AdminUsersPage />} />
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
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/forgotpassword" element={<ForgotPass />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
