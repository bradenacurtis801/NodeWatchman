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
    if (window.location.pathname.includes("Node_MAAS_Status.html")) {
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