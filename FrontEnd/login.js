// login.js
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch(`http://${config.BACKEND_SERVER_IP}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Save token
        window.location.href = 'home.html'; // Redirect to GUI
    } else {
        alert('Login failed');
    }
});
