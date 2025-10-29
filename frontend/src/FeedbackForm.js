import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';  // ADDED IMPORT

const FeedbackForm = () => {
  const [studentName, setStudentName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!studentName.trim()) newErrors.studentName = 'Student Name is required';
    if (!courseCode.trim()) newErrors.courseCode = 'Course Code is required';
    if (rating < 1 || rating > 5) newErrors.rating = 'Rating must be between 1 and 5';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      // UPDATED URL - uses config
      await axios.post(`${API_BASE_URL}/api/feedback`, { studentName, courseCode, comments, rating });
      setErrors({});
      setStudentName(''); setCourseCode(''); setComments(''); setRating(1);
      navigate('/dashboard'); // Redirect to dashboard after submit
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-4"> {/* Kept width smaller */}
        <div className="card shadow">
          <div className="card-body p-2"> {/* Reduced padding to p-2 for shorter height */}
            <h5 className="card-title text-center mb-2">Rate a Course</h5> {/* Changed to h5 and mb-2 for compactness */}
            <form onSubmit={handleSubmit}>
              <div className="mb-1"> {/* Reduced to mb-1 */}
                <label className="form-label small">Student Name</label> {/* Added small class for smaller label */}
                <input type="text" className="form-control form-control-sm" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                {errors.studentName && <div className="text-danger small mt-1">{errors.studentName}</div>} {/* Added mt-1 for tight spacing */}
              </div>
              <div className="mb-1">
                <label className="form-label small">Course Code</label>
                <input type="text" className="form-control form-control-sm" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} />
                {errors.courseCode && <div className="text-danger small mt-1">{errors.courseCode}</div>}
              </div>
              <div className="mb-1">
                <label className="form-label small">Comments</label>
                <textarea className="form-control form-control-sm" rows="1" value={comments} onChange={(e) => setComments(e.target.value)} /> {/* Reduced to rows=1 */}
              </div>
              <div className="mb-1">
                <label className="form-label small">Rating (1-5)</label>
                <select className="form-select form-select-sm" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.rating && <div className="text-danger small mt-1">{errors.rating}</div>}
              </div>
              <button type="submit" className="btn btn-primary btn-sm w-100">Submit Feedback</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;