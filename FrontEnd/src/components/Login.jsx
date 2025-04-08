import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://wingsearch.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      
      // Refresh the page after successful login
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-logo">
          <h1>WingSearch</h1>
        </div>

        <div className="signup-form-container">
          <form className="signup-form" onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="next-button" disabled={loading}>
              {loading ? 'Logging in...' : 'NEXT'}
            </button>
            <div className="separator">
              <hr /><span>or</span><hr />
            </div>
            <button type="button" className="login-button" onClick={() => navigate('/signup')}>
              SIGN UP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 