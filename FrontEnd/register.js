document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://192.168.200.54:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = './login.html'; // Redirect to login page after registration
        } else {
            alert('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('There was an error:', error);
    }
});
