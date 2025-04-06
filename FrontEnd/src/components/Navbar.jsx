import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="nav-container">
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/ticket-search">Ticket Search</Link>
          <Link to="/flight-track">Flight Track</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>
        <div className="nav-right">
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>
    </div>
  );
}