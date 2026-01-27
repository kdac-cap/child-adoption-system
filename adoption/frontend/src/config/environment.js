// Environment configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8080/api',
    FRONTEND_URL: 'http://localhost:5173',
  },
  production: {
    API_BASE_URL: '/api',
    FRONTEND_URL: window.location.origin,
  }
};

const environment = import.meta.env.MODE || 'development';

export default config[environment];