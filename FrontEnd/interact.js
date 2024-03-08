document.addEventListener("DOMContentLoaded", () => {
    const runCustomScriptBtn = document.getElementById('runCustomScriptBtn');
    const customScriptModal = document.getElementById('customScriptModal');
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
      if (event.target == customScriptModal) {
        customScriptModal.style.display = 'none';
      }
    };
  
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
    const ipsList = nodeInfoAll.map(obj => Object.values(obj)[0].ip); // Extracting IPs from each object
    const ipsString = ipsList.join(','); // Joining all IPs into a single string separated by commas
    const bashCommand = `
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

    console.log('Sending Node Info to /execute-script:', nodeInfo);
  
    // Sending the nodeInfo object to the /execute-script endpoint
    const executeScriptUrl = 'http://localhost:5000/execute-script';
    try {
      const executeResponse = await fetch(executeScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeInfo), // Assuming nodeInfo is the object to send
      });
      const executeResult = await executeResponse.json();
      console.log('Execution Result:', executeResult);
  
      // Forwarding the response to another endpoint
      const updateStateUrl = `http://${config.BACKEND_SERVER_IP}/interact/update-machine-state`;
      const updateResponse = await fetch(updateStateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ips: ipsString, script: bashCommand}), // Forwarding the response received from the previous request
      });
      const updateResult = await updateResponse.json();
      console.log('Update Machine State Result:', updateResult);
    } catch (error) {
      console.error('Error in processing:', error);
    }
  });
  