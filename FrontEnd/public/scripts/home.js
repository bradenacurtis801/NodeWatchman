const token = localStorage.getItem('token'); // Retrieve the token from storage

function getMachineIP(rackLabel, index) {
  // Assuming rackLabel and index are already in the desired format
  // and directly usable as the last two octets of the IP address.
  const networkBase = "10.10"; // Base network address
  return `${networkBase}.${rackLabel}.${index}`;
}

function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.textContent) element.textContent = options.textContent;
  if (options.id) element.id = options.id;
  if (options.attributes) {
      Object.keys(options.attributes).forEach(key => {
          element.setAttribute(key, options.attributes[key]);
      });
  }
  if (options.events) {
      Object.keys(options.events).forEach(event => {
          element.addEventListener(event, options.events[event]);
      });
  }
  return element;
}

function createLabel(text, className) {
    return createElement('div', {className: className, textContent: text});
}

function createBox(rowLabel, rackLabel, index, eventHandlers) {
  const boxId = `${rowLabel}-${rackLabel}-${index}`;
  const ipAddress = getMachineIP(rackLabel, index); // Get the machine's IP address
  const box = createElement('div', {
      className: 'box',
      id: boxId,
      textContent: index,
      attributes: {
          'data-ip': ipAddress // Store the IP address as a data attribute
      },
      events: eventHandlers // Use the passed eventHandlers object
  });
  return box;
}

function createButton(text, className, onClick) {
    return createElement('button', {
        className: className,
        textContent: text,
        events: { click: onClick }
    });
}

function createBoxContainer(sectionId, rowLabel, rackLabel) {
  const section = document.getElementById(sectionId);
  let rowContainer = section.querySelector(`.${rowLabel}-row-container`) || 
                     createElement('div', {
                         className: `${rowLabel}-row-container row-container`,
                         attributes: {'data-row': rowLabel}
                     });

  if (!section.contains(rowContainer)) section.appendChild(rowContainer);

  const container = createElement('div', {className: 'parent-box'});
  const labels = createElement('div', {className: 'labels'});

  labels.appendChild(createLabel(`Row: ${rowLabel}`, 'header-row-span'));
  labels.appendChild(createLabel(`Rack: ${rackLabel}`, 'header-rack-span'));

  if (window.location.pathname.includes("Node_MAAS_Status.html")) {
      const resetButton = createButton("Reset", "box-reset-button", () => {
          if (confirm("Are you sure you want to reset these boxes?")) resetBoxes(boxesContainer);
      });
      labels.appendChild(resetButton);
  }

  container.appendChild(labels);

  const boxesContainer = createElement('div', {className: 'boxes-container'});
  for (let i = 1; i <= 20; i++) {
      boxesContainer.appendChild(createBox(rowLabel, rackLabel, i));
  }

  container.appendChild(boxesContainer);
  rowContainer.appendChild(container);
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




document.addEventListener("DOMContentLoaded", function () {
  // Token expiration check
  checkAndHandleTokenExpiration();

  console.log(config.BACKEND_SERVER_IP);

   // Event listener for the Refresh button
  const refreshButton = document.getElementById('getRBM_Update');
  const overlay = document.getElementById('overlay');

if (refreshButton) {
    refreshButton.addEventListener('click', () => {
        // Call updateMiners
        updateMiners();
    });
}
  const homeButton = document.getElementById('homeButton');
  if (homeButton) {
    homeButton.addEventListener("click", function () {
    window.location.href = 'home.html';
  });
  }

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
      window.location.href = '/LoginPage/login.html';
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        localStorage.removeItem('token');
      }
    });
  }


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
  createBoxContainer("section-B", "B2", "122");
  createBoxContainer("section-B", "B2", "123");
  createBoxContainer("section-B", "B2", "124");
  createBoxContainer("section-B", "B2", "125");
  // ... more calls as needed
  // Initially set to read mode
  disableBoxInteractions();
}
