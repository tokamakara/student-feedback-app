import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';

const FeedbackForm = () => {
  const [studentName, setStudentName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Enhanced validation as per assignment requirements
  const validateForm = () => {
    const newErrors = {};

    // Student Name validation - required
    if (!studentName.trim()) {
      newErrors.studentName = 'Student Name is required';
    } else if (studentName.trim().length < 2) {
      newErrors.studentName = 'Student Name must be at least 2 characters';
    }

    // Course Code validation - required
    if (!courseCode.trim()) {
      newErrors.courseCode = 'Course Code is required';
    } else if (courseCode.trim().length < 2) {
      newErrors.courseCode = 'Course Code must be at least 2 characters';
    }

    // Rating validation - must be between 1-5
    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    return newErrors;
  };

  // Real-time validation on input change
  const handleInputChange = (field, value) => {
    switch (field) {
      case 'studentName':
        setStudentName(value);
        if (errors.studentName) {
          const newErrors = { ...errors };
          delete newErrors.studentName;
          setErrors(newErrors);
        }
        break;
      case 'courseCode':
        setCourseCode(value);
        if (errors.courseCode) {
          const newErrors = { ...errors };
          delete newErrors.courseCode;
          setErrors(newErrors);
        }
        break;
      case 'rating':
        setRating(Number(value));
        if (errors.rating) {
          const newErrors = { ...errors };
          delete newErrors.rating;
          setErrors(newErrors);
        }
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Submit to backend
      await axios.post(`${API_BASE_URL}/api/feedback`, {
        studentName: studentName.trim(),
        courseCode: courseCode.trim(),
        comments: comments.trim(),
        rating: rating
      });

      // Reset form on success
      setStudentName('');
      setCourseCode('');
      setComments('');
      setRating(1);
      setErrors({});
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrors({ submit: 'Failed to submit feedback. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body">
            <h4 className="card-title text-center mb-4">Rate a Course</h4>
            
            {/* Submission error message */}
            {errors.submit && (
              <div className="alert alert-danger" role="alert">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Student Name Field */}
              <div className="mb-3">
                <label htmlFor="studentName" className="form-label">
                  Student Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.studentName ? 'is-invalid' : ''}`}
                  id="studentName"
                  value={studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  required
                />
                {errors.studentName && (
                  <div className="invalid-feedback">
                    {errors.studentName}
                  </div>
                )}
              </div>

              {/* Course Code Field */}
              <div className="mb-3">
                <label htmlFor="courseCode" className="form-label">
                  Course Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.courseCode ? 'is-invalid' : ''}`}
                  id="courseCode"
                  value={courseCode}
                  onChange={(e) => handleInputChange('courseCode', e.target.value)}
                  required
                />
                {errors.courseCode && (
                  <div className="invalid-feedback">
                    {errors.courseCode}
                  </div>
                )}
              </div>

              {/* Comments Field */}
              <div className="mb-3">
                <label htmlFor="comments" className="form-label">
                  Comments
                </label>
                <textarea
                  className="form-control"
                  id="comments"
                  rows="3"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Optional comments about the course..."
                />
              </div>

              {/* Rating Field */}
              <div className="mb-4">
                <label htmlFor="rating" className="form-label">
                  Rating <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${errors.rating ? 'is-invalid' : ''}`}
                  id="rating"
                  value={rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  required
                >
                  <option value="">Select a rating</option>
                  <option value="1">1 - Very Poor</option>
                  <option value="2">2 - Poor</option>
                  <option value="3">3 - Average</option>
                  <option value="4">4 - Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
                {errors.rating && (
                  <div className="invalid-feedback">
                    {errors.rating}
                  </div>
                )}
                <div className="form-text">
                  Please rate the course from 1 (Very Poor) to 5 (Excellent)
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </button>

              {/* Required fields note */}
              <div className="mt-3">
                <small className="text-muted">
                  Fields marked with <span className="text-danger">*</span> are required
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;