// config.js
export const serverUrl = 'http://localhost:8080'; // URL for your Express backend

const config = {
  development: {
    backendUrl: `${serverUrl}/api/v1/dalle`, // Adjusted endpoint for your Express backend
  },
  production: {
    backendUrl: `${serverUrl}/api/v1/dalle`, // Adjusted endpoint for your Express backend
  },
};

export default config;
