// config.js
const config = {
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  endpoints: {
    files: '/api/files',
    users: '/api/users'
  }
};

export default config;
