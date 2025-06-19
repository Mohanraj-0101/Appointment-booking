import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { addDoc, collection, onSnapshot, query, where, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './UserAppointment.css';

function UserAppointment() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [reason, setReason] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');
  const [unavailableDates, setUnavailableDates] = useState([]);

  // Auth listener to get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserProfile({
            name: userDoc.data().name,
            email: userDoc.data().email
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch appointments for current user
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'appointments'), where('userId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Message timeout
  useEffect(() => {
    if (submitMsg) {
      const timer = setTimeout(() => setSubmitMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitMsg]);

  // Request Appointment Function
  const requestAppointment = async () => {
    if (!date || !time || !reason) {
      setSubmitMsg('❌ Please fill all fields.');
      return;
    }
    if (!currentUser || !userProfile) {
      setSubmitMsg('❌ User not authenticated or profile missing.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        userId: currentUser.uid,
        name: userProfile.name,   // Add name
        email: userProfile.email, // Add email
        reason,
        date: date.toISOString().split('T')[0],
        time,
        status: 'pending',
        timestamp: new Date(),
      });
      setReason('');
      setDate(null);
      setTime('');
      setSubmitMsg('✅ Appointment requested successfully!');
    } catch (error) {
      setSubmitMsg('❌ Failed to request appointment.');
    }
    setLoading(false);
  };

  // Delete appointment
  const handleDelete = async (appointmentId) => {
    try {
      await deleteDoc(doc(db, 'appointments', appointmentId));
    } catch (error) {
      console.error('Failed to delete appointment:', error);
    }
  };

  return (
    <div className="appointment-container">
      <h2>📅 Request Appointment</h2>

      <div className="appointment-form">
        <div><strong>Name:</strong> {userProfile?.name || 'Unknown'}</div>
        <div><strong>Email:</strong> {userProfile?.email || 'Unknown'}</div>

        <div className="date-time-wrapper">
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            placeholderText="Select Date"
            minDate={new Date()}
            excludeDates={unavailableDates.map(d => new Date(d))}
            dateFormat="yyyy-MM-dd"
            className="datepicker"
          />
          <select value={time} onChange={(e) => setTime(e.target.value)} className="time-select">
            <option value="">Time Slot</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="10:30 AM">10:30 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="11:30 AM">11:30 AM</option>
            <option value="12:00 PM">12:00 PM</option>
          </select>
        </div>

        <textarea
          placeholder="Reason for Appointment"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="reason-textarea"
        />

        <button onClick={requestAppointment} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>

        {submitMsg && <p className="submit-msg">{submitMsg}</p>}
      </div>

      <h3>🗂️ Your Appointments</h3>
      <ul className="appointments-list">
        {appointments.map(app => (
          <li key={app.id}>
            <div className="date-time-display">
              <div><strong>Date:</strong> {app.date}</div>
              <div><strong>Time:</strong> {app.time}</div>
            </div>

            <div className="reason-section">
              <h4>📝 Reason:</h4>
              <p>{app.reason}</p>
            </div>

            <div className="appointment-footer">
              <span className={`status ${app.status}`}>{app.status}</span>
              <button className="delete-btn" onClick={() => handleDelete(app.id)}>🗑️ Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserAppointment;
