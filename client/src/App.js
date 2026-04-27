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
import EditProfile from './pages/EditProfile';
import About from './pages/About';
import Notifications from './pages/Notifications';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Landing />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />
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
        <Route path="/edit-profile" element={
            <ProtectedRoute><EditProfile /></ProtectedRoute>
        } />
       <Route path="/notifications" element={
          <ProtectedRoute><Notifications /></ProtectedRoute>
        } />

      <Route path="/about" element={<About />} />
      </Routes>
      {user && <DockNav />}
    </BrowserRouter>
  );
};
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;