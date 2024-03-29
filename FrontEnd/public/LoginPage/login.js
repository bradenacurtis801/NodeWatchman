// login.js
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('username');
    const password = formData.get('password');
    const bodyData = { email, password };
    console.log(bodyData);
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
});

document.getElementById('registerBtn').addEventListener('click', function() {
    window.location.href = '../register.html';
});
