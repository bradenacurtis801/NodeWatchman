// Function to send the current state to the server
async function saveStateToServer(boxStates) {
    try {
      const response = await fetch(`http://${config.BACKEND_SERVER_IP}/save-machine-state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ boxStates: boxStates })
      });
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  // Function to save the state of boxes
function saveBoxState() {
    checkAndHandleTokenExpiration()
    const boxStates = {};
    document.querySelectorAll('.box').forEach(box => {
      // Example of how you might determine the color - adjust as needed
      const color = box.style.backgroundColor || 'defaultColor'; // Fallback to 'defaultColor'
      boxStates[box.id] = {
        id: box.id,
        color: color
      };
    });
    saveStateToServer(boxStates); // Send the state to the server
  }

  // Apply the state to the boxes
function applyBoxState(savedStates) {
    document.querySelectorAll('.box').forEach(box => {
      const boxState = savedStates[box.id];
      if (boxState && boxState.color) {
        // Apply the color directly to the box's style
        box.style.backgroundColor = boxState.color;
      } else {
        // Apply default color or remove the style
        box.style.backgroundColor = ""; // Set to your default color or remove the style
      }
    });
  }

  function disableBoxInteractions() {
    document.querySelectorAll('.box').forEach(box => {
      box.style.pointerEvents = 'none'; // Disable click events
    });
  }
  
  function enableBoxInteractions() {
    document.querySelectorAll('.box').forEach(box => {
      box.style.pointerEvents = 'auto'; // Enable click events
    });
  }
  
  // Function to reset boxes within a specific container
  function resetBoxes(container) {
    container.querySelectorAll('.box').forEach(box => {
      box.style.backgroundColor = ''; // Remove any set color
    });
    saveBoxState(); // Save the updated state
  }

  // Function to cycle box colors on each click
function cycleBoxColor(box) {
    const colors = ['green', 'yellow', 'red'];
    const currentColor = box.style.backgroundColor;
    const currentColorIndex = colors.indexOf(currentColor);
    const nextColorIndex = (currentColorIndex + 1) % colors.length;
    box.style.backgroundColor = colors[nextColorIndex];
  }
  
  // Function to reset box color on right-click
  function resetBoxColor(box) {
    box.style.backgroundColor = ''; // Remove any set color
  }

  // Load box state specifically for MAAS UI
async function loadBoxState() {
    const apiUrl = `http://${config.BACKEND_SERVER_IP}/load-machine-state`; // No source parameter needed
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch state for MAAS UI');
      }
  
      const data = await response.json();
      console.log("MAAS UI data", data);
      if (data && data.boxStates) {
        applyBoxState(data.boxStates); // Ensure this function is defined to apply the state to boxes
      }
    } catch (error) {
      console.error('Error loading state for MAAS UI:', error);
    }
  }
  



  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.classList.add("box-reset-button");
  resetButton.addEventListener("click", function () {
    // Display confirmation dialog
    const confirmed = confirm("Are you sure you want to reset these boxes?");
    if (confirmed) {
      resetBoxes(boxesContainer);
    }
  });
  labels.appendChild(resetButton);
