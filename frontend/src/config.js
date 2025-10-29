// Configuration for API URLs
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://student-feedback-backend-p0oe.onrender.com'  // YOUR ACTUAL BACKEND URL
  : 'http://localhost:5000';

export { API_BASE_URL };