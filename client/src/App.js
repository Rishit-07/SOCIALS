import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider, { AuthContext } from "./context/AuthContext";
import { DockProvider } from "./context/DockContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeDetail from "./pages/ChallengeDetail";
import Profile from "./pages/Profile";
import DockNav from "./components/DockNav";
import DockHint from "./components/DockHint";
import Community from './pages/Community';
import EditProfile from './pages/EditProfile';
import About from './pages/About';
import Guide from './pages/Guide';
import Notifications from './pages/Notifications';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AppFooter from './components/AppFooter';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" replace />;
};

const AppContent = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Landing />}
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
      <Route path="/guide" element={
          <ProtectedRoute><Guide /></ProtectedRoute>
      } />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      </Routes>
      <AppFooter isAuthenticated={!!user} />
      {user && (
        <>
          <DockNav />
          <DockHint />
        </>
      )}
    </BrowserRouter>
  );
};
const App = () => {
  return (
    <AuthProvider>
      <DockProvider>
        <AppContent />
      </DockProvider>
    </AuthProvider>
  );
};

export default App;
