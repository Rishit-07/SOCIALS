import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeDetail from "./pages/ChallengeDetail";
import Profile from "./pages/Profile";
import DockNav from "./components/DockNav";
import Community from './pages/Community';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DockNav />
        <Routes>
          <Route path="/" element={<Landing />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/community" element={<Community />} />
<Route path="/dashboard" element={
    <ProtectedRoute><Dashboard /></ProtectedRoute>
} />
<Route path="/create" element={
    <ProtectedRoute><CreateChallenge /></ProtectedRoute>
} />
<Route path="/challenge/:id" element={
    <ProtectedRoute><ChallengeDetail /></ProtectedRoute>
} />
<Route path="/profile" element={
    <ProtectedRoute><Profile /></ProtectedRoute>
} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;