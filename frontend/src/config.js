// Configuration for API URLs - different for development vs production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://student-feedback-backend.onrender.com'  // Your live backend URL
  : 'http://localhost:5000';

export { API_BASE_URL };