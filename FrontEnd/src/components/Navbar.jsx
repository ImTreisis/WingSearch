import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
    window.location.reload();
  };

  const handleWishlistClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <div className="nav-container">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/ticketsearch">Search Flights</Link>
          <Link to="/FlightTracker">Track Flight</Link>
          <Link 
            to="/wishlist" 
            onClick={handleWishlistClick}
            className={!isAuthenticated ? 'wishlist-link' : ''}
          >
            My Wishlist
          </Link>
        </div>
        <div className="nav-right">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/Signup">Signup</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}