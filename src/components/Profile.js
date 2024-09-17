import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="profile">
      <h1>User Profile</h1>
      {user ? (
        <div>
          <p>Name: {user.displayName || 'N/A'}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
};

export default Profile;