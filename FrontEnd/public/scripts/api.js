async function executeScript(ipsString, bashCode) {
    const executeScriptUrl = `http://${config.SSH_SERVER_IP}/execute-script`;
    try {
      const response = await fetch(executeScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ips: ipsString, script: bashCode }),
      });
      const data = await response.json();
      return data; // Return the JSON response
    } catch (error) {
      console.error("Error in executing script:", error);
      throw error; // Rethrow the error to handle it in the calling context
    }
  }
  
  async function updateMachineState(mappedArrayFormatted) {
    const updateStateUrl = `http://${config.BACKEND_SERVER_IP}/interact/update-machine-state`;
    try {
      const response = await fetch(updateStateUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mappedArrayFormatted),
      });
      const data = await response.json();
      return data; // Return the JSON response
    } catch (error) {
      console.error("Error in updating machine state:", error);
      throw error; // Rethrow the error to handle it in the calling context
    }
  }

  async function fetchHardwareInfo() {
    const apiEndpoint = `http://${config.BACKEND_SERVER_IP}/interact/dc02-hardware-info`;
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch state: ${response.statusText}`);
    }
    return response.json();
  }

  async function loadBoxState() {
    const apiUrl = `http://${config.BACKEND_SERVER_IP}/interact/load-machine-state`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch state");
      }
  
      const data = await response.json();
      // Assuming applyBoxState correctly handles the array structure of data
      if (Array.isArray(data)) {
        applyBoxState(data);
        
	    return data;
      } else console.error('data object is not an array:', data);
    } catch (error) {
      console.error("Error loading state:", error);
    }
  }
  
async function checkNH_Rigs() {
    // const apiEndpoint = `http://${config.SSH_SERVER_IP}/get-nh-rig-status`;
    const apiEndpoint = `http://localhost:5001/get-nh-rig-status`;
    const response = await fetch(apiEndpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch state: ${response.statusText}`);
    }
    rigs = await response.json();
    const rigsNotMining = rigs.filter(rig => rig.minerStatus !== 'MINING');
    console.log("Rigs Not Mining:", rigsNotMining);
}

checkNH_Rigs()