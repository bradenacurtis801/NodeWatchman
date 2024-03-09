document.addEventListener("DOMContentLoaded", () => {
    loadBoxState();
    const runCustomScriptBtn = document.getElementById('runCustomScriptBtn');
    const customScriptModal = document.getElementById('customScriptModal');
    const textareaContainer = document.getElementById('textareaContainer');
    const textareaInput = document.getElementById('textareaInput');
    const closeBtn = customScriptModal.querySelector('.close');
    const startCommandBtn = document.getElementById('startCommand');
    
    runCustomScriptBtn.addEventListener('click', () => {
      customScriptModal.style.display = 'block';
      displaySelectedMachines();
    });
  
    closeBtn.addEventListener('click', () => {
      customScriptModal.style.display = 'none';
    });
  
    window.onclick = (event) => {
      console.log(event.target);
      if (event.target == customScriptModal && !isMouseDownInsideTextarea) {
        customScriptModal.style.display = 'none';
      }
    };

    let isMouseDownInsideTextarea = false;

    window.addEventListener('mousedown', (event) => {
      console.log(event.target);
      if (event.target == textareaContainer || event.target == textareaInput) {
          console.log('Mouse down inside textarea');
          isMouseDownInsideTextarea = true;
      } else isMouseDownInsideTextarea = false;
  });
  
    function displaySelectedMachines() {
      const selectedMachinesDiv = document.getElementById('selectedMachines');
      selectedMachinesDiv.innerHTML = ''; // Clear previous content
  
      // Use the manager object to find selected machines
      manager.rows.forEach(row => {
        row.racks.forEach(rack => {
          rack.selectedBoxes.forEach(box => {
            const machineDiv = document.createElement('div');
            machineDiv.textContent = `Machine IP: ${box.ip}`;
            selectedMachinesDiv.appendChild(machineDiv);
          });
        });
      });
    }
  });

  startCommandBtn.addEventListener('click', async () => {
    const bashCode = document.getElementById('bashCode').value;
    const selectedMachines = [];
    manager.rows.forEach(row => {
      row.racks.forEach(rack => {
        rack.selectedBoxes.forEach(box => {
          selectedMachines.push(box.ip);
        });
      });
    });
    const ipsString = selectedMachines.join(',');

    console.log('Sending Bash Script and IPs to server:', bashCode, ipsString);

    // Example POST request to a server-side endpoint that executes the bash script
    const url = 'http://localhost:5000/execute-script';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ips: ipsString, script: bashCode }),
      });
      const result = await response.json();
      console.log('Execution Result:', result);
    } catch (error) {
      console.error('Error executing script:', error);
    }
  });
  
  document.getElementById('getNodeStatusBtn').addEventListener('click', async () => {
    // Get the info from manager.getInfoAll()
    const nodeInfo = manager.getInfoAll(); // Assuming manager.getInfoAll() returns the required object
    const ipsList = nodeInfo.map(obj => Object.values(obj)[0].ip); // Extracting IPs from each object
    const ipsString = ipsList.join(','); // Joining all IPs into a single string separated by commas
    const bashCode = `
      ip addr | awk '
          $1 ~ /^[0-9]+:/ { 
              if (iface != "" && mac != "") print iface": "mac
              iface = $2; sub(/:$/, "", iface); mac = "" 
          }
          $1 == "link/ether" { mac = $2 }
          END {
              if (iface != "" && mac != "") print iface": "mac
          }
      '`;

    console.log('Sending Node Info to /execute-script:',bashCode, ipsString);
  
    // Sending the nodeInfo object to the /execute-script endpoint
    const executeScriptUrl = 'http://localhost:5000/execute-script';
    try {
      const executeResponse = await fetch(executeScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ips: ipsString, script: bashCode }), // Assuming nodeInfo is the object to send
      });
      const executeResult = await executeResponse.json();
      const mappedInfo = executeResult.reduce((acc, obj) => {
        const id = generateIdFromIp(obj.ip);
        acc[id] = obj;
        return acc;
      }, {});
     const mappedArray = Object.entries(mappedInfo).map(([id, obj]) => {
       const color = obj.error ? 'red' : 'green';
       return { [id]: { ...obj, color } };
     });
     console.log('Execution Result:', mappedArray);
  
      // Forwarding the response to another endpoint
      const updateStateUrl = `http://${config.BACKEND_SERVER_IP}:${config.BACKEND_SERVER_PORT}/interact/update-machine-state`;
      const updateResponse = await fetch(updateStateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappedArray), // Forwarding the response received from the previous request
      });
      const updateResult = await updateResponse.json();
      console.log('Update Machine State Result:', updateResult);} catch (error) {
      console.error('Error in processing:', error);
    }
  });

async function loadBoxState() {
  // Determine which endpoint to use based on the HTML page
  const page = document.body.getAttribute('data-page');
  let apiUrl = `http://${config.BACKEND_SERVER_IP}:${config.BACKEND_SERVER_PORT}/interact/load-machine-state`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch state');
    }

    const data = await response.json();
    console.log("data",data)
    if (data && Array.isArray(data)) {
      const boxStates = Object.assign({}, ...data);
      applyBoxState(boxStates);
    }
  } catch (error) {
    console.error('Error loading state:', error);
  }
}

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

function generateIdFromIp(ip) {
  const octets = ip.split(".").map(Number);
  if (octets.length !== 4) {
    throw new Error("Invalid IP address format");
  }

  const [network1, network2, thirdOctet, machineNumber] = octets;

  // Determine if third octet is in the specified range for Section A
  const sectionARange = [11, 12, 13, 14, 21, 22, 23, 24, 25];
  const sectionBRange = [111, 112, 113, 121, 122, 123, 124, 125];
  let section;
  if (sectionARange.includes(thirdOctet)) {
    section = "A";
  } else if (sectionBRange.includes(thirdOctet)) {
    section = "B";
  } else {
    section = "Unknown";
  }

  // Determine the number based on the range of the third octet
  let number;
  if (
    (thirdOctet >= 11 && thirdOctet <= 19) ||
    (thirdOctet >= 111 && thirdOctet <= 119)
  ) {
    number = 1;
  } else if (
    (thirdOctet >= 21 && thirdOctet <= 29) ||
    (thirdOctet >= 121 && thirdOctet <= 129)
  ) {
    number = 2;
  } else {
    number = "Unknown"; // Placeholder, adjust as needed
  }

  // Construct the ID
  const id = `${section}${number}-${thirdOctet}-${machineNumber}`;
  return id;
}
