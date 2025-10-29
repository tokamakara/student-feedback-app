import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
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
        await axios.delete(`${API_BASE_URL}/api/feedback/${id}`);
        fetchFeedbacks();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  return (
    <div>
      <h4 className="text-center mb-4">All Feedback</h4>
      {feedbacks.length === 0 ? (
        <p className="text-center text-muted">No feedback submitted yet.</p>
      ) : (
        <div className="row">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="col-md-4 mb-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">Full Name</h6>
                  <h5 className="card-title">{fb.studentName}</h5>
                  
                  <h6 className="card-subtitle mb-2 text-muted">Course Code</h6>
                  <p className="card-text fw-bold">{fb.courseCode}</p>
                  
                  <h6 className="card-subtitle mb-2 text-muted">Comments</h6>
                  <p className="card-text">{fb.comments}</p>
                  
                  <h6 className="card-subtitle mb-2 text-muted">Rating</h6>
                  <p className="card-text">
                    <span className="badge bg-primary fs-6">{fb.rating}/5</span>
                  </p>
                </div>
                <div className="card-footer">
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(fb.id)}>
                    Delete
                  </button>
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