
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

  // Add reset button for each parent box
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.classList.add("box-reset-button"); 
  resetButton.addEventListener("click", function() {
      resetBoxes(boxesContainer);
  });
  labels.appendChild(resetButton);

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
    const debouncedSaveBoxState = debounce(() => saveBoxState(), 5000);
    box.addEventListener("click", function () {
        box.classList.toggle("highlighted");
        // debouncedSaveBoxState(); // Use the debounced function
    });
    boxesContainer.appendChild(box);
}

  // Append the new rack container to the row-container
  rowContainer.appendChild(container);
}

// Function to save the state of boxes
function saveBoxState() {
  const boxStates = {};
  document.querySelectorAll('.box').forEach(box => {
      boxStates[box.id] = box.classList.contains('highlighted');
  });
  saveStateToServer(boxStates); // Send the state to the server
}

// Function to load the saved state of boxes
async function loadBoxState() {
  try {
      const response = await fetch('http://192.168.200.54:3000/load-machine-state');
      const data = await response.json();
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
      if (savedStates[box.id]) {
          box.classList.add('highlighted');
      }
  });
}

// Function to send the current state to the server
async function saveStateToServer(boxStates) {
  try {
      const response = await fetch('http://192.168.200.54:3000/save-machine-state', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ boxStates: boxStates })
      });
      const data = await response.json();
      console.log('Success:', data);
  } catch (error) {
      console.error('Error:', error);
  }
}


// Function to reset boxes
function resetBoxes(container) {
  container.querySelectorAll('.box').forEach(box => {
      box.classList.remove('highlighted');
  });
  saveBoxState(); // Save the updated state
}


function debounce(func, delay) {
  let debounceTimer;
  return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
  }
}

// Function to create a top-level save button
function createTopLevelSaveButton() {
  const topLevelSaveButton = document.getElementById('saveStateButton');

  topLevelSaveButton.addEventListener("click", function() {
      saveBoxState(); // Directly call saveBoxState when clicked
  });
}


// Function to create a top-level reset button
function createTopLevelResetButton() {
  const topLevelResetButton = document.getElementById('resetAllButton');

  topLevelResetButton.addEventListener("click", function() {
      // Ask for confirmation before resetting
      const confirmed = confirm("Are you sure you want to reset all boxes?");
      if (confirmed) {
          document.querySelectorAll('.box').forEach(box => {
              box.classList.remove('highlighted');
          });
          saveBoxState(); // Save the updated state
      }
  });
}




document.addEventListener("DOMContentLoaded", function () {
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
  createTopLevelSaveButton(); // Create the top-level save button
  createTopLevelResetButton();
  loadBoxState(); // Load the saved state after creating all boxes
});
