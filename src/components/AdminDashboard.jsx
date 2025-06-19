import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import './AdminDashboard.css';

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'appointments'), (snapshot) => {
      const updatedAppointments = snapshot.docs.map((docItem) => {
        const appointmentData = docItem.data();
        return { id: docItem.id, ...appointmentData };
      });
      setAppointments(updatedAppointments);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, 'appointments', id), { status: 'approved' });
  };

  const handleReject = async (id) => {
    await deleteDoc(doc(db, 'appointments', id));
  };

  return (
    <div className="admin-container">
      <h2>📊 Admin - Manage Appointments</h2>

      {appointments.length === 0 ? (
        <p>No Appointments Found</p>
      ) : (
        appointments.map(app => (
          <div key={app.id} className="appointment-card">
            <div><strong>Name:</strong> {app.name || 'Unknown'}</div>
            <div><strong>Email:</strong> {app.email || 'Unknown'}</div>
            <div><strong>Date:</strong> {app.date}</div>
            <div><strong>Time:</strong> {app.time}</div>
            <div><strong>Reason:</strong> {app.reason}</div>
            <div><strong>Status:</strong> {app.status}</div>

            {app.status === 'pending' && (
              <div className="admin-actions">
                <button onClick={() => handleApprove(app.id)}>✅ Approve</button>
                <button onClick={() => handleReject(app.id)}>❌ Reject</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
