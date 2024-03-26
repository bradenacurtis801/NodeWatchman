document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    
    const formData = new FormData(event.target);
    const email = formData.get('username'); // Assuming 'username' is the field name for email
    const password = formData.get('password');
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if any of the fields are empty
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
        alert('Please fill out all fields.');
        return; // Stop further execution if any field is empty
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return; // Stop further execution if passwords do not match
    }

    const bodyData = { email, password };
    console.log('bodydata', bodyData);

    try {
        const response = await fetch(`http://${config.BACKEND_SERVER_IP}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const responseData = await response.json(); // Safely parsing the JSON

            if (response.status === 202 && responseData.message === 'Sign-up request submitted. Please wait for administrator approval.') {
                alert('Sign-up request submitted. Please wait for administrator approval.');
                window.location.href = './login.html';
            } else {
                // Handle other server-side messages
                alert(responseData.message || 'Registration failed. Please try again.');
            }
        } else {
            // If response is not JSON
            const textResponse = await response.text();
            alert(textResponse || 'An unexpected error occurred.');
        }
    } catch (error) {
        console.error('There was an error:', error);
        alert('There was an error processing your registration. Please try again.');
    }
});

document.getElementById('loginBtn').addEventListener('click', function() {
    window.location.href = '../LoginPage/login.html'; // Navigate to login.html
});
