import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const Dashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/feedback`);
      setFeedbacks(response.data);
      calculateAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const calculateAnalytics = (data) => {
    if (data.length === 0) {
      setAnalytics(null);
      return;
    }

    const courseRatings = {};
    const ratingCount = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    let totalRating = 0;

    data.forEach(fb => {
      if (!courseRatings[fb.courseCode]) {
        courseRatings[fb.courseCode] = { total: 0, count: 0, average: 0 };
      }
      courseRatings[fb.courseCode].total += fb.rating;
      courseRatings[fb.courseCode].count += 1;
      courseRatings[fb.courseCode].average = 
        (courseRatings[fb.courseCode].total / courseRatings[fb.courseCode].count).toFixed(1);

      ratingCount[fb.rating] += 1;
      totalRating += fb.rating;
    });

    const courseAnalytics = Object.entries(courseRatings).map(([course, stats]) => ({
      course,
      average: stats.average,
      count: stats.count
    }));

    setAnalytics({
      totalFeedbacks: data.length,
      averageRating: (totalRating / data.length).toFixed(1),
      ratingDistribution: ratingCount,
      courseAnalytics: courseAnalytics.sort((a, b) => b.average - a.average)
    });
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

  const StarRating = ({ rating }) => {
    return (
      <div className="d-inline">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={star <= rating ? "text-warning" : "text-muted"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h4 className="text-center mb-4">Feedback Dashboard</h4>

      {/* SIMPLE ANALYTICS SECTION */}
      {analytics && analytics.totalFeedbacks > 0 && (
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="text-primary">{analytics.averageRating}</h5>
                <p className="mb-0">Average Rating</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="text-info">{analytics.totalFeedbacks}</h5>
                <p className="mb-0">Total Feedback</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="text-success">{analytics.courseAnalytics.length}</h5>
                <p className="mb-0">Courses Rated</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK LIST */}
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
                    <StarRating rating={fb.rating} />
                    <span className="ms-2 badge bg-primary">{fb.rating}/5</span>
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