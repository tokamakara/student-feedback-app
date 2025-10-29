import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';  // ADDED IMPORT

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      // UPDATED URL - uses config
      const response = await axios.get(`${API_BASE_URL}/api/feedback`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        // UPDATED URL - uses config
        await axios.delete(`${API_BASE_URL}/api/feedback/${id}`);
        fetchFeedbacks();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  return (
    <div>
      <h4 className="text-center mb-4">Feedback Dashboard</h4>
      {feedbacks.length === 0 ? (
        <p className="text-center text-muted">No feedback submitted yet.</p>
      ) : (
        <div className="row">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="col-md-4 mb-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title">{fb.studentName} - {fb.courseCode}</h5>
                  <p className="card-text">{fb.comments}</p>
                  <p className="card-text"><strong>Rating:</strong> {fb.rating}/5</p>
                </div>
                <div className="card-footer">
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(fb.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;