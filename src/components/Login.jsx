import { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const role = userDoc.data().role;

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } else {
      alert("⚠️ No user data found in Firestore. Contact support or try signing up again.");
    }

  } catch (error) {
    alert("❌ Login failed: " + error.message);
  }
};



    return (
        <div className="login-container">
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            <p style={{ marginTop: '15px' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#007BFF', fontWeight: 'bold', textDecoration: 'none' }}>
                    Sign Up
                </Link>
            </p>
        </div>
    );
}

export default Login;
