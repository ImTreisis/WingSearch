import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-logo">
          <h1>WingSearch</h1>
        </div>
        
        <div className="signup-form-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="next-button">
              NEXT
            </button>
            <div className="separator">
              <hr /><span>or</span><hr />
            </div>
            <button type="button" className="login-button">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}