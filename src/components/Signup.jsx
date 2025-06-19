import { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(db, 'users', userCredential.user.uid), {
                name: name,     
                email: email,
                role: 'user'
            });

            alert("Signup successful! Please login.");
            navigate('/login');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert("Email already exists. Please use a different email.");
            } else {
                alert(error.message);
            }
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
            />
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
            />
            <button onClick={handleSignup}>Sign Up</button>

            <p style={{ marginTop: '15px' }}>
                Already have an account?{' '}
                <Link to="/login" className="login-link">Login</Link>
            </p>
        </div>
    );
}

export default Signup;
