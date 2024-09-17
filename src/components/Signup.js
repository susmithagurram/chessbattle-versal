import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import '../styles/Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to create an account. Please try again.');
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="signup">
      <header>
        <h1>Chess Game</h1>
      </header>
      <main>
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
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
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </main>
    </div>
  );
};

export default Signup;