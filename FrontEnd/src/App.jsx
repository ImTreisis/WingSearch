import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Hero';
import Signup from './components/Signup';
import Login from './components/Login';
import TicketSearch from './components/ticketsearch';
import FlightTracker from './components/FlightTracker';
import Wishlist from './components/Wishlist';
import { AuthProvider, useAuth } from './components/Auth';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/ticketsearch" element={<TicketSearch />} />
        <Route path="/FlightTracker" element={<FlightTracker />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
