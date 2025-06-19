import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import UserAppointment from './components/UserAppointment';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import { UserContext } from './UserContext';

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);  // <-- Added

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData({
            uid: user.uid,
            email: user.email,
            name: userDoc.data().name || 'User',
            role: userDoc.data().role || 'user'
          });
        } else {
          setUserData({
            uid: user.uid,
            email: user.email,
            name: 'User',
            role: 'user'
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);  // <-- Once data loaded
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Optional: You can add a beautiful spinner here
  }

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user" element={<UserAppointment />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
