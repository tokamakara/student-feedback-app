import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const Analytics = () => {
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

    // Course ratings analytics
    const courseRatings = {};
    const ratingCount = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    let totalRating = 0;

    data.forEach(fb => {
      // Course-specific ratings
      if (!courseRatings[fb.courseCode]) {
        courseRatings[fb.courseCode] = { total: 0, count: 0, average: 0 };
      }
      courseRatings[fb.courseCode].total += fb.rating;
      courseRatings[fb.courseCode].count += 1;
      courseRatings[fb.courseCode].average = 
        (courseRatings[fb.courseCode].total / courseRatings[fb.courseCode].count).toFixed(1);

      // Overall rating distribution
      ratingCount[fb.rating] += 1;
      totalRating += fb.rating;
    });

    // Convert course ratings to array for display
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

  // Star rating display component
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
        <span className="ms-1">({rating})</span>
      </div>
    );
  };

  // Rating bar component
  const RatingBar = ({ rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="d-flex align-items-center mb-2">
        <small className="me-2" style={{ width: '20px' }}>{rating}★</small>
        <div className="progress flex-grow-1" style={{ height: '8px' }}>
          <div 
            className="progress-bar bg-warning" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <small className="ms-2 text-muted" style={{ width: '30px' }}>
          {count}
        </small>
      </div>
    );
  };

  return (
    <div>
      <h4 className="text-center mb-4">Analytics Dashboard</h4>

      {/* ANALYTICS SECTION */}
      {analytics && analytics.totalFeedbacks > 0 ? (
        <div className="row">
          {/* Overall Statistics */}
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0">Overall Statistics</h6>
              </div>
              <div className="card-body">
                <div className="text-center">
                  <h3 className="text-primary">{analytics.averageRating}</h3>
                  <StarRating rating={Math.round(analytics.averageRating)} />
                  <p className="text-muted mb-0">
                    {analytics.totalFeedbacks} total feedback{analytics.totalFeedbacks !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0">Rating Distribution</h6>
              </div>
              <div className="card-body">
                {[5, 4, 3, 2, 1].map(rating => (
                  <RatingBar 
                    key={rating}
                    rating={rating}
                    count={analytics.ratingDistribution[rating]}
                    total={analytics.totalFeedbacks}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Course Ratings */}
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">Course Ratings</h6>
              </div>
              <div className="card-body">
                {analytics.courseAnalytics.map(course => (
                  <div key={course.course} className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-truncate" style={{ maxWidth: '60%' }}>
                      {course.course}
                    </small>
                    <div className="text-end">
                      <StarRating rating={Math.round(course.average)} />
                      <small className="text-muted">({course.count})</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-muted">No feedback data available for analytics.</p>
      )}
    </div>
  );
};

export default Analytics;