import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { FiLogOut } from 'react-icons/fi';
import { UserContext } from '../UserContext';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  let timeoutRef = useRef(null);
  const { userData, setUserData } = useContext(UserContext);

  const handleLogout = async () => {
    await signOut(auth);
    setUserData(null);
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';

  useEffect(() => {
    if (showDropdown) {
      timeoutRef.current = setTimeout(() => {
        setShowDropdown(false);
      }, 3000);
      return () => clearTimeout(timeoutRef.current);
    }
  }, [showDropdown]);

  const keepDropdownOpen = () => clearTimeout(timeoutRef.current);
  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 1000);
  };

  const avatarLetter = userData?.name?.charAt(0)?.toUpperCase() || '👤';

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {isAuthPage ? (
          <Link to="/">🩵 AppointmentPro</Link>
        ) : (
          <span>🩵 AppointmentPro</span>
        )}
      </div>

      <div className="navbar-links">
        {isAuthPage ? (
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        ) : (
          <div className="profile-section">
            <div className="profile-avatar" onClick={() => setShowDropdown(!showDropdown)}>
              {avatarLetter}
            </div>

            {showDropdown && (
              <div
                className="logout-dropdown"
                ref={dropdownRef}
                onMouseEnter={keepDropdownOpen}
                onMouseLeave={closeDropdown}
                onClick={handleLogout}
              >
                <FiLogOut className="logout-icon" /> Logout
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
