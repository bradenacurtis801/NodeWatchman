// login.js
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const email = formData.get('username');
    const password = formData.get('password');
    
    // Check if both fields are filled out
    if (!email || !password) {
        alert('Please fill out both email and password fields.');
        return; // Stop further execution
    }
    
    // Proceed with login
    const bodyData = { email, password };
    console.log(bodyData);
    try {
        const response = await fetch(`http://${config.BACKEND_SERVER_IP}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Save token
            window.location.href = '../../interact.html'; // Redirect to GUI
        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});


document.getElementById('registerBtn').addEventListener('click', function() {
    window.location.href = '../RegisterPage/register.html';
});
