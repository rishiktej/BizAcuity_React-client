import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Bgframe from "../bgframe";
import Dashboard from "../Dashboard/user/main";
import ProtectedRoute from "./protectedroute";
import Profile from "../Dashboard/user/profile";
import ForgotPass from "../Authentication/user/forgotpass";
import AdminSignUpForm from "../Authentication/admin/signup";
import AdminSignInForm from "../Authentication/admin/signin";
import AdminDashboard from "../Dashboard/admin/main";
import AdminUsersPage from "../Dashboard/admin/allusers";
import UserHomePage from "../userHome";
import HomePage from "../Home";
import NewsletterSender from "../Dashboard/admin/newsletter";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user" element={<UserHomePage />} />
          <Route path="/admin/signup" element={<AdminSignUpForm />} />
          <Route path="/admin/signin" element={<AdminSignInForm />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/userslist" element={<AdminUsersPage />} />
          <Route path="/admin/send-newsletter" element={<NewsletterSender />} />
          <Route
            path="/user/create/"
            element={
              <ProtectedRoute>
                <Bgframe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/user/forgotpassword" element={<ForgotPass />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
