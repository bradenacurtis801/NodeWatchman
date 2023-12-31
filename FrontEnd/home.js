const token = localStorage.getItem('token'); // Retrieve the token from storage

function createBoxContainer(sectionId, rowLabel, rackLabel) {
  // Find the section to append the container
  const section = document.getElementById(sectionId);

  // Check if a row-container with the specified rowLabel already exists
  let rowContainer = section.querySelector(`.${rowLabel}-row-container`);

  if (!rowContainer) {
    // Create a new row-container if it doesn't exist
    rowContainer = document.createElement("div");
    rowContainer.classList.add(`${rowLabel}-row-container`, "row-container");
    rowContainer.setAttribute("data-row", rowLabel);
    section.appendChild(rowContainer);
  }

  // Create a new container for the specific rackLabel
  const container = document.createElement("div");
  container.classList.add("parent-box");

  const labels = document.createElement("div");
  labels.classList.add("labels");
  container.appendChild(labels);

  // Check if the current page is home.html before adding the reset button
  if (window.location.pathname.includes("home.html")) {
    // Add reset button for each parent box
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
  }


  const rowSpan = document.createElement("div");
  rowSpan.classList.add("header-row-span");
  rowSpan.textContent = "Row: " + rowLabel;
  labels.appendChild(rowSpan);

  const rackSpan = document.createElement("div");
  rackSpan.classList.add("header-rack-span"); // Added class for consistency
  rackSpan.textContent = "Rack: " + rackLabel;
  labels.appendChild(rackSpan);

  const boxesContainer = document.createElement("div");
  boxesContainer.classList.add("boxes-container");
  container.appendChild(boxesContainer);

  // Create boxes and append to the boxes-container
  for (let i = 1; i <= 20; i++) {
    const boxId = `${rowLabel}-${rackLabel}-${i}`; // Unique identifier
    const box = document.createElement("div");
    box.id = boxId; // Set the unique ID
    box.classList.add("box");
    box.textContent = i;

    // Left-click event listener
    box.addEventListener("click", function (event) {
      // Prevent default right-click menu if it's a right-click
      if (event.button === 2) {
        return;
      }
      cycleBoxColor(box); // Cycle through colors
      // debouncedSaveBoxState(); // Use the debounced function (automatically save every 5 seconds)
    });

    // Right-click event listener
    box.addEventListener("contextmenu", function (event) {
      event.preventDefault(); // Prevent default right-click menu
      resetBoxColor(box); // Reset the box color
      // debouncedSaveBoxState(); // Use the debounced function (automatically save every 5 seconds)
    });

    // Long press event variables
    let pressTimer;
    let pressStartTime;

    // Touch events for mobile devices
    box.addEventListener("touchstart", function (event) {
      event.preventDefault(); // Prevent the default long press action
      pressStartTime = new Date().getTime();
      pressTimer = window.setTimeout(function () { resetBoxColor(box); }, 1000); // 1000 ms for long press
    });

    box.addEventListener("touchend", function (event) {
      const pressDuration = new Date().getTime() - pressStartTime;
      if (pressDuration < 1000) { // If it's a short press
        cycleBoxColor(box); // Change the color
      }
      clearTimeout(pressTimer);
    });

    // Mouse events for non-touch devices
    box.addEventListener("mousedown", function () {
      pressStartTime = new Date().getTime();
      pressTimer = window.setTimeout(function () { resetBoxColor(box); }, 1000); // 1000 ms for long press
    });

    box.addEventListener("mouseup", function () {
      const pressDuration = new Date().getTime() - pressStartTime;
      if (pressDuration < 1000) { // If it's a short press
        cycleBoxColor(box); // Change the color
      }
      clearTimeout(pressTimer);
    });

    box.addEventListener("mouseleave", function () {
      clearTimeout(pressTimer);
    });

    boxesContainer.appendChild(box);
  }

  // Append the new rack container to the row-container
  rowContainer.appendChild(container);
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


// Function to load the saved state of boxes
async function loadBoxState() {
  // Determine which endpoint to use based on the HTML page
  const page = document.body.getAttribute('data-page');
  let apiUrl = `http://${config.BACKEND_SERVER_IP}/load-machine-state`;

  if (page === 'rbm_monitor') {
    apiUrl += '?source=rbm';
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch state');
    }

    const data = await response.json();
    console.log("data",data)
    if (data && data.boxStates) {
      applyBoxState(data.boxStates);
    }
  } catch (error) {
    console.error('Error loading state:', error);
  }
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

function debounce(func, delay) {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  }
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

function checkAndHandleTokenExpiration() {
  const token = localStorage.getItem('token');
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token'); // Remove the expired or invalid token
    window.location.href = 'login.html';
    return false;
  }
  return true;
}


// Function to reset boxes within a specific container
function resetBoxes(container) {
  container.querySelectorAll('.box').forEach(box => {
    box.style.backgroundColor = ''; // Remove any set color
  });
  saveBoxState(); // Save the updated state
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
  const token = localStorage.getItem('token');
  console.log('before auth', token)
  if (!token || isTokenExpired(token)) {
    console.log('after auth')
    alert('Session expired. Please log in again.');
    window.location.href = 'login.html';
    return true; // Indicate that the token has expired
  }
  return false; // Token is still valid
}

async function updateMiners() {
  try {
      const response = await fetch(`http://${config.BACKEND_SERVER_IP}/update-miners`);
      if (response.ok) {
          console.log('Miners updated successfully. Reloading the page.');
          // Reload the page
          window.location.reload();
      } else {
          console.error('Failed to update miners');
          // Update the UI to notify the user of the failure
      }
  } catch (error) {
      console.error('Error:', error);
      // Update the UI to notify the user of the error
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log(config.BACKEND_SERVER_IP);

  // Event listener for the Refresh button
  const refreshButton = document.getElementById('getRBM_Update');
  if (refreshButton) {

    refreshButton.addEventListener('click', () => {
      updateMiners();
  });
  }

  const homeButton = document.getElementById('homeButton');
  homeButton.addEventListener("click", function () {
      window.location.href = 'home.html';
  });

  // Check for the existence of elements before adding event listeners
  const topLevelSaveButton = document.getElementById('saveStateButton');
  if (topLevelSaveButton) {
    topLevelSaveButton.addEventListener("click", function () {
      saveBoxState(); // Directly call saveBoxState when clicked
      // Check the toggle to 'read' mode
      const modeToggle = document.getElementById('modeToggle');
      if (modeToggle) {
        modeToggle.checked = true;
        disableBoxInteractions();
      }
    });
  }

  const topLevelResetButton = document.getElementById('resetAllButton');
  if (topLevelResetButton) {
    topLevelResetButton.addEventListener("click", function () {
      const confirmed = confirm("Are you sure you want to reset all boxes?");
      if (confirmed) {
        document.querySelectorAll('.box').forEach(box => {
          box.style.backgroundColor = ''; // Remove any set color
        });
        saveBoxState(); // Save the updated state
      }
    });
  }

  // Logout Button logic
  const logoutButton = document.getElementById('logoutBtn');
  if (logoutButton) {
    logoutButton.addEventListener('click', async function () {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        localStorage.removeItem('token');
        window.location.href = 'login.html';
      }
    });
  }

  // Token expiration check
  checkAndHandleTokenExpiration();

  // Mode toggle logic
  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle) {
    modeToggle.addEventListener('change', function () {
      if (this.checked) {
        disableBoxInteractions();
      } else {
        enableBoxInteractions();
      }
    });
    // Initially set to read mode
    disableBoxInteractions();
  }

  // Create box containers
  createBoxContainers();

  // Load the state of boxes
  loadBoxState();
});


function createBoxContainers() {
  createBoxContainer("section-A", "A1", "11");
  createBoxContainer("section-A", "A1", "12");
  createBoxContainer("section-A", "A1", "13");
  createBoxContainer("section-A", "A1", "14");

  createBoxContainer("section-A", "A2", "21");
  createBoxContainer("section-A", "A2", "22");
  createBoxContainer("section-A", "A2", "23");
  createBoxContainer("section-A", "A2", "24");
  createBoxContainer("section-A", "A2", "25");

  createBoxContainer("section-B", "B1", "111");
  createBoxContainer("section-B", "B1", "112");
  createBoxContainer("section-B", "B1", "113");

  createBoxContainer("section-B", "B2", "121");
  createBoxContainer("section-B", "B2", "123");
  createBoxContainer("section-B", "B2", "124");
  // ... more calls as needed
  // Initially set to read mode
  disableBoxInteractions();
}
