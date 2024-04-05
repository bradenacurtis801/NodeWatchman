// config.js
const config = {
  production: {
    BACKEND_SERVER: '10.10.250.101:3000',
    FRONTEND_SERVER: '10.10.250.101:5500',
    SSH_SERVER: '10.10.250.101:5000',
  },
  development: {
    BACKEND_SERVER: 'localhost:3000',
    FRONTEND_SERVER: 'localhost:5500',
    SSH_SERVER: 'localhost:5000',
  }
  };

  prod = config.production
  dev = config.development
   
  
