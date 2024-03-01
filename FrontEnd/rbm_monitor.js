async function updateMiners() {
    overlay.style.display = "flex";
    let isRateLimitHit = false;

    try {
        const response = await fetch(`http://${config.BACKEND_SERVER_IP}/update-miners`);
        if (response.ok) {
            console.log('Miners updated successfully. Reloading the page.');
            window.location.reload();
        } else {
            const errorMessage = await response.text();

            if (response.status === 429) {
                console.error('Rate limit hit:', errorMessage);
                isRateLimitHit = true;
            } else {
                console.error('Failed to update miners:', errorMessage);
            }

            // Show the error message after hiding the overlay
            overlay.style.display = "none";
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating miners.');
    } finally {
        // Ensure overlay is hidden if not a rate limit error
        if (!isRateLimitHit) {
            overlay.style.display = "none";
        }
    }
}

// Load box state specifically for RBM Monitor
async function loadBoxState() {
    const apiUrl = `http://${config.BACKEND_SERVER_IP}/load-machine-state?source=rbm`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch state for RBM Monitor');
      }
  
      const data = await response.json();
      console.log("RBM Monitor data", data);
      if (data && data.boxStates) {
        applyBoxState(data.boxStates); // Ensure this function is defined to apply the state to boxes
      }
    } catch (error) {
      console.error('Error loading state for RBM Monitor:', error);
    }
  }