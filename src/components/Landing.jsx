import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to AppointmentPro</h1>
      <p className="landing-subtitle">
        Simplify appointment scheduling for your business
      </p>
      <p className="landing-description">
        AppointmentPro helps businesses and customers connect seamlessly.
        Schedule, manage, and organize appointments effortlessly.
        Whether you're running a clinic, salon, consultancy, or any service — AppointmentPro makes your booking system smarter.
      </p>
      <div className="landing-buttons">
        <Link to="/signup">
          <button>Get Started</button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;
