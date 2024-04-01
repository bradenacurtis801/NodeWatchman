import axios from 'axios';

async function register(email, username, password) {
  try {
    const response = await axios.post('http://localhost:3001/register', {
      email,
      username,
      password
    });
    console.log('Register response:', response.data);
  } catch (error) {
    console.error('Error during registration:', error.response.data);
  }
}

async function login(email, password) {
  try {
    const response = await axios.post('http://localhost:3000/login', {
      loginIdentifier: email, // Use email as the login identifier
      password
    });
    console.log('Login token:', response);
    return response.data.token; // You might need the token for subsequent requests
  } catch (error) {
    console.error('Error during login:', error);
  }
}


async function approve(userId, adminToken) {
  try {
    const response = await axios.post(`http://localhost:3001/approve/${userId}`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('Approve response:', response.data);
  } catch (error) {
    console.error('Error during approval:', error.response.data);
  }
}

async function adminRevoke(user_email, adminToken) {
  try {
    const response = await axios.post('http://localhost:3001/admin/revoke', {
      user_email
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('Revoke response:', response.data);
  } catch (error) {
    console.error('Error during revoke:', error.response.data);
  }
}

async function testFlow() {
  // await register('newuser@gmail.com', 'newuser', 'newpassword');
  const token = await login('bradenacurtis801@gmail.com', 'wpkf0224');
  // Use the token for approve and adminRevoke functions...

  // await adminRevoke('newuser@gmail.com', token);


}

testFlow();
  
  