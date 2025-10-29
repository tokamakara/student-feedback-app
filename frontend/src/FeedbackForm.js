import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';

const FeedbackForm = () => {
  const [fullName, setFullName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Enhanced validation - ALL FIELDS REQUIRED with proper rules
  const validateForm = () => {
    const newErrors = {};

    // Full Name validation - letters and spaces only, min 2 words
    const nameRegex = /^[A-Za-z\s\-']+$/;
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (!nameRegex.test(fullName)) {
      newErrors.fullName = 'Full Name can only contain letters, spaces, hyphens, and apostrophes';
    } else if (fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Please enter your full name (first and last name)';
    } else if (fullName.trim().length < 5) {
      newErrors.fullName = 'Full Name must be at least 5 characters';
    }

    // Course Code validation - alphanumeric with specific format
    const courseRegex = /^[A-Za-z0-9]+$/;
    if (!courseCode.trim()) {
      newErrors.courseCode = 'Course Code is required';
    } else if (!courseRegex.test(courseCode)) {
      newErrors.courseCode = 'Course Code can only contain letters and numbers';
    } else if (courseCode.trim().length < 3) {
      newErrors.courseCode = 'Course Code must be at least 3 characters';
    }

    // Comments validation - REQUIRED
    if (!comments.trim()) {
      newErrors.comments = 'Comments are required';
    } else if (comments.trim().length < 10) {
      newErrors.comments = 'Comments must be at least 10 characters';
    } else if (comments.trim().length > 500) {
      newErrors.comments = 'Comments cannot exceed 500 characters';
    }

    // Rating validation - must be between 1-5
    if (!rating) {
      newErrors.rating = 'Rating is required';
    } else if (rating < 1 || rating > 5) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    return newErrors;
  };

  // REAL-TIME NUMBER BLOCKING for Full Name - FIXED VERSION
  const handleFullNameChange = (e) => {
    const value = e.target.value;
    
    // COMPLETE BLOCK: Only allow letters, spaces, hyphens, and apostrophes
    // This will PREVENT numbers from ever appearing
    const filteredValue = value.replace(/[^A-Za-z\s\-']/g, '');
    
    setFullName(filteredValue);
    
    // Clear error when user types
    if (errors.fullName) {
      const newErrors = { ...errors };
      delete newErrors.fullName;
      setErrors(newErrors);
    }
  };

  // Real-time validation for other fields
  const handleInputChange = (field, value) => {
    switch (field) {
      case 'courseCode':
        setCourseCode(value.toUpperCase()); // Auto-uppercase course codes
        if (errors.courseCode) {
          const newErrors = { ...errors };
          delete newErrors.courseCode;
          setErrors(newErrors);
        }
        break;
      case 'comments':
        setComments(value);
        if (errors.comments) {
          const newErrors = { ...errors };
          delete newErrors.comments;
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
        studentName: fullName.trim(),
        courseCode: courseCode.trim(),
        comments: comments.trim(),
        rating: rating
      });

      // Reset form on success
      setFullName('');
      setCourseCode('');
      setComments('');
      setRating('');
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
              {/* Full Name Field */}
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                  id="fullName"
                  value={fullName}
                  onChange={handleFullNameChange}
                  placeholder="Enter your first and last name"
                  required
                />
                {errors.fullName && (
                  <div className="invalid-feedback">
                    {errors.fullName}
                  </div>
                )}
              </div>

              {/* Course Code Field */}
              <div className="mb-3">
                <label htmlFor="courseCode" className="form-label">
                  Course Code
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.courseCode ? 'is-invalid' : ''}`}
                  id="courseCode"
                  value={courseCode}
                  onChange={(e) => handleInputChange('courseCode', e.target.value)}
                  placeholder="e.g., CS101, MATH202"
                  required
                />
                {errors.courseCode && (
                  <div className="invalid-feedback">
                    {errors.courseCode}
                  </div>
                )}
              </div>

              {/* Comments Field - REQUIRED */}
              <div className="mb-3">
                <label htmlFor="comments" className="form-label">
                  Comments
                </label>
                <textarea
                  className={`form-control ${errors.comments ? 'is-invalid' : ''}`}
                  id="comments"
                  rows="4"
                  value={comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  placeholder="Share your detailed feedback about the course..."
                  required
                />
                {errors.comments && (
                  <div className="invalid-feedback">
                    {errors.comments}
                  </div>
                )}
                <div className="form-text">
                </div>
              </div>

              {/* Rating Field */}
              <div className="mb-4">
                <label htmlFor="rating" className="form-label">
                  Rating
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;