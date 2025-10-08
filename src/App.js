import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Spinner from "./components/common/Spinner";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PrivateRoute from "./components/layout/PrivateRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  return (
    <>
      <Router>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-100 font-sans">
            <Header />
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path="/" element={<PrivateRoute />}>
                  <Route path="/" element={<Dashboard />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Suspense>
          </div>
        </ErrorBoundary>
      </Router>
    </>
  );
}

export default App;
