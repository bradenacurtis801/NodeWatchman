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
  