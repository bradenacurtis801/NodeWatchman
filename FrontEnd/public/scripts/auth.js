function isTokenExpired(token) {
    if (!token) return true;
  
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const exp = payload.exp;
    const currentTime = Date.now() / 1000;
    console.log(exp, currentTime)
  
    return exp < currentTime;
  }
  
  function checkAndHandleTokenExpiration() {
    // USED FOR TESTING UNCOMMENT LINE BELOW FOR PRODUCTION
    return false
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token'); // Remove the expired or invalid token
      window.location.href = '/LoginPage/login.html';
      return true; // Indicate that the token has expired
    }
    return false; // Token is still valid
  }

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64)).exp;
    } catch (error) {
      return null;
    }
  }