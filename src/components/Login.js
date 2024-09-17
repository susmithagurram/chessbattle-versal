import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to log in. Please check your email and password.');
      console.error('Error logging in:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      setError('Failed to log in with Google. Please try again.');
      console.error('Error logging in with Google:', error);
    }
  };

  return (
    <div className="login">
      <header>
        <h1>Chess Game</h1>
      </header>
      <main>
        <h2>Log in</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Log In</button>
        </form>
        <button onClick={handleGoogleLogin} className="google-button">Continue with Google</button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </main>
    </div>
  );
};

export default Login;