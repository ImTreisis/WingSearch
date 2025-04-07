import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Hero';
import Signup from './components/Signup';
import Login from './components/Login';
import TicketSearch from './components/ticketsearch';
import FlightTracker from './components/FlightTracker';
import Wishlist from './components/Wishlist';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/ticketsearch" element={<TicketSearch />} />
          <Route path="/FlightTracker" element={<FlightTracker />} />
          <Route path="/login" element={<Login />} />
          <Route path="/wishlist" element={isAuthenticated ? <Wishlist /> : <Navigate to="/login" />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
