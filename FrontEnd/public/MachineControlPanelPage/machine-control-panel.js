document.addEventListener("DOMContentLoaded", async () => {

  // REFACTOR CODE //
  /////////////////////////////////////////////////////

  function updateTotalMachines(runningMachines, totalMachines) {
    const runningMachinesPlaceholder = document.getElementById("running-machines-placeholder");
    const totalMachinesPlaceholder = document.getElementById("total-machines-placeholder");

    // Update the placeholders with the actual values or '*' if they don't have a value
    runningMachinesPlaceholder.textContent = runningMachines !== undefined ? runningMachines : '*';
    totalMachinesPlaceholder.textContent = totalMachines !== undefined ? totalMachines : '*';
  }

  async function initializeBoxState() {
    let boxState;
    try {
      boxState = await loadBoxState();
      // Proceed with operations that depend on boxState
      const runningMachines = countRunningMachines(boxState);
      const totalMachines = manager.getMachineCount();
      updateTotalMachines(runningMachines, totalMachines);
    } catch (error) {
      console.error(error);
      // Handle error, possibly updating the UI to reflect the failure
    }
  }

  // Call initializeBoxState without awaiting it, allowing the DOMContentLoaded event to complete.
  initializeBoxState();
  //////////////////////////////////////////////////////

  const runCustomScriptBtn = document.getElementById("runCustomScriptBtn");
  const customScriptModal = document.getElementById("customScriptModal");
  const textareaContainer = document.getElementById("textareaContainer");
  const textareaInput = document.getElementById("textareaInput");
  const closeBtn = customScriptModal.querySelector(".close");
  const startCommandBtn = document.getElementById("startCommandBtn");
  const updateNodesBtn = document.getElementById("getNodeStatusBtn");
  const logoutBtn = document.getElementById('logoutBtn');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');

  runCustomScriptBtn.addEventListener("click", () => {
    customScriptModal.style.display = "block";
    displaySelectedMachines();
  });

  closeBtn.addEventListener("click", () => {
    customScriptModal.style.display = "none";
  });

  window.onclick = (event) => {
    //console.log(event.target);
    if (event.target == customScriptModal && !isMouseDownInsideTextarea) {
      customScriptModal.style.display = "none";
    }
  };

  let isMouseDownInsideTextarea = false;

  window.addEventListener("mousedown", (event) => {
    // console.log(event.target);
    if (event.target == textareaContainer || event.target == textareaInput) {
      // console.log("Mouse down inside textarea");
      isMouseDownInsideTextarea = true;
    } else isMouseDownInsideTextarea = false;
  });

  function openTab(evt, tabName) {
    // Use const for variables that do not change
    const tabcontent = document.getElementsByClassName("tabcontent");
    const tablinks = document.getElementsByClassName("tablinks");

    // Use Array.from() to convert HTMLCollections to arrays. This allows use of forEach
    Array.from(tabcontent).forEach((element) => {
      element.style.display = "none"; // Hide all tab content
    });

    Array.from(tablinks).forEach((element) => {
      element.classList.remove("active"); // Remove 'active' class from all tabs
    });

    // Display the selected tab content and add 'active' class to the clicked tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
  }

  // Set default open tab (optional)
  // Use querySelector to directly click on the default open tab if present
  document.querySelector(".tablinks.defaultOpen")?.click();

  function displaySelectedMachines() {
    const selectedMachinesDiv = document.getElementById("selectedMachines");
    selectedMachinesDiv.innerHTML = ""; // Clear previous content
    const selectedIPs = manager.getSelectedBoxesIps();

    // Use the manager object to find selected machines
    selectedIPs.forEach(ip => {
      const machineDiv = document.createElement("div");
      machineDiv.textContent = `Machine IP: ${ip}`; // Use the IP directly
      selectedMachinesDiv.appendChild(machineDiv);
    });
  }
  // Add an event listener for the click event on the logout button
  logoutBtn.addEventListener('click', async function () {
    console.log("Logging out...");
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // If a token exists, send a logout request to the server
    if (token) {
      await fetch('/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // Regardless of the server's response, remove the token from localStorage
      localStorage.removeItem('token');
    }

    // Redirect the user to the login page
    window.location.href = '/LoginPage/login.html';
  });

  // selectAllBtn.addEventListener("click", () => {
  //   console.log(manager.selectAllBoxes(),'selectAllBtn clicked')
  //   // manager.selectAllBtn()
  // })

  // clearAllBtn.addEventListener("click", () => {
  //   console.log(manager.clearAllSelection(),'clearAllBtn clicked')
  //   // manager.clearAllBtn()
  // })

  let commandExecutions = {
    completed: [],
    pending: []
};

startCommandBtn.addEventListener("click", async () => {
  console.log('running start command');
  const bashCode = document.getElementById("textareaInput").value;
  const ipsString = manager.getSelectedBoxesIps();

  console.log("Sending Bash Script and IPs to server:", bashCode, ipsString);

  // Utility function to append messages to the modal
  const updateExecutionStatus = (message, isError = false) => {
      const statusDiv = document.getElementById("customScriptModalExecutionStatus");
      const messageElement = document.createElement("div");
      messageElement.textContent = message;
      if (isError) {
          // messageElement.style.color = "red";
      } else {
        statusDiv.appendChild(messageElement);
      }
  };

  const executeCommand = async () => {
      try {
          const result = await executeScript(ipsString, bashCode);
          console.log("Execution Result:", result);
          displayBashOutput(result);
          console.log("after");
          return {status: 'completed', result};
      } catch (error) {
          console.error("Error executing script:", error);
          throw {status: 'failed', error}; // Include status in thrown error for consistency
      }
  };

  const handleCompletion = (index, result) => {
      commandExecutions.completed.push({index, ...result});
      commandExecutions.pending = commandExecutions.pending.filter(item => item !== index);
      if (result.status === 'completed') {
          updateExecutionStatus(`Command ${index} completed successfully.`);
      } else {
          updateExecutionStatus(`Command ${index} failed: ${result.error}`, true);
      }
  };

  const commandIndex = commandExecutions.pending.length + commandExecutions.completed.length;
  commandExecutions.pending.push(commandIndex);

  // Append initial pending status
  updateExecutionStatus(`Command ${commandIndex} is pending execution.`);

  executeCommand().then(result => {
      console.log(`Command ${commandIndex} completed`, result);
      handleCompletion(commandIndex, result);
  }).catch(error => {
      console.error(`Command ${commandIndex} failed`, error);
      handleCompletion(commandIndex, error);
  });

  console.log(`Command ${commandIndex} is being executed`);
  console.log('current commands:', commandExecutions);
});


  updateNodesBtn.addEventListener("click", async () => {
      const ipsString = manager.getIpAll();
      const bashCode = `
    ip addr | awk '
    $1 ~ /^[0-9]+:/ {
        if (iface != "" && mac != "") print iface": "mac;
        iface = $2; sub(/:$/, "", iface); mac = "";
    }
    $1 == "link/ether" { mac = $2; }
    END {
        if (iface != "" && mac != "") print iface": "mac;
    }
    '`;

      console.log("Sending Node Info to /execute-script:", bashCode, ipsString);
      // return
      try {
        const executeResult = await executeScript(ipsString, bashCode);
        console.log('pre exe', executeResult);
        const mappedInfo = processExecutionResult(executeResult)

        console.log("Execution Result:", mappedInfo);
        displayBashOutput(Object.values(mappedInfo));
        const mappedArrayFormatted = reformatJsonArray(Object.values(mappedInfo));
        // Forwarding the response to another endpoint
        console.log('formateed arr', mappedArrayFormatted);
        const updateResult = await updateMachineState(mappedArrayFormatted);
        console.log("Update Machine State Result:", updateResult);
      } catch (error) {
        console.error("Error in processing:", error);
      }
    });









  function displayBashOutput(mappedArray) {
    const bashOutputContainer = document.getElementById("BashOutput");
    bashOutputContainer.innerHTML = ""; // Clear existing content

    mappedArray.forEach((item, index) => {
      let obj; // This will store the relevant object (either directly or nested)
      let id; // This will store the identifier (IP or custom ID)

      // Check if the item is in the first format with a unique key
      if (Object.keys(item).length === 1 && Object.keys(item)[0] !== "ip") {
        id = Object.keys(item)[0];
        obj = item[id];
      } else {
        // Assume it's in the second format
        obj = item;
        id = obj.ip;
      }

      const elementId = `collapse-${index}`;
      const wrapperDiv = document.createElement("div");
      wrapperDiv.classList.add("collapsible-wrapper");

      const button = document.createElement("button");
      button.textContent = id + (obj.error ? ` - Error` : ` - Result`);
      button.classList.add("collapsible-btn");
      button.setAttribute("type", "button");
      button.setAttribute("data-target", elementId);

      const contentDiv = document.createElement("div");
      contentDiv.id = elementId;
      contentDiv.classList.add("collapsible-content");
      contentDiv.style.display = "none"; // Initially hidden

      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.className = "language-bash"; // Ensure this class is set for Highlight.js

      // Handle content based on whether it's an error or a result
      if (obj.error) {
        code.textContent = `Error: ${obj.error}`;
      } else if (obj.result && obj.result.cmd) {
        code.textContent = `IP: ${id}\nCommand:\n${obj.result.cmd}\nOutput:\n${obj.result.output}`;
      } else {
        code.textContent = `No detailed information available.`;
      }

      pre.appendChild(code);
      contentDiv.appendChild(pre);
      wrapperDiv.appendChild(button);
      wrapperDiv.appendChild(contentDiv);
      bashOutputContainer.appendChild(wrapperDiv);

      button.addEventListener("click", function () {
        const target = document.getElementById(this.getAttribute("data-target"));
        if (target.style.display === "none") {
          target.style.display = "block";
          // Apply highlighting when the content is shown
          hljs.highlightElement(code); // Make sure to highlight after appending
        } else {
          target.style.display = "none";
        }
      });
    });
  }
});




async function applyBoxState(savedStates) {
  try {
    // Fetch the hardware information from the API

    const DC02_HARDWARE = await fetchHardwareInfo();
    let a = checkBoxPosition(DC02_HARDWARE, savedStates);
    console.log('mismatched', a)
    document.querySelectorAll(".box").forEach((box) => {
      const boxState = savedStates.find((state) => state[box.id]);

      // Clear previous mismatch class if any
      box.classList.remove("box_mismatch");

      // Apply colors based on saved states, if available
      if (boxState && boxState[box.id].color) {
        box.style.backgroundColor = boxState[box.id].color;
      } else {
        box.style.backgroundColor = ""; // Set to your default color or remove the style
      }

      // Check if the box ID is in the mismatch array and add 'box_mismatch' class
      const isMismatched = a.some((mismatch) =>
        mismatch.hasOwnProperty(box.id)
      );
      if (isMismatched) {
        box.classList.add("box_mismatch");
      }
    });
  } catch (error) {
    console.error("Error fetching hardware information:", error);
  }
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

function reformatJsonArray(jsonArray, outputFile = null) {
  /*
    Transforms the input JSON array by filtering out entries with errors and reformatting the ethernet interface data.

    Example Transformation:

    Before:
    [{
      "machine1": {
        "ip": "192.168.1.1",
        "error": false,
        "result": {
          "cmd": "ip addr",
          "output": "eth0: 00:1A:2B:3C:4D:5E\neth1: 5F:4E:3D:2C:1B:0A"
        },
        "color": "green"
      }
    }]

    After:
    [{
      "machine1": {
        "ip": "192.168.1.1",
        "ethernet_interfaces": {
          "MAC (NIC-1) eth0": "00:1A:2B:3C:4D:5E",
          "MAC (NIC-2) eth1": "5F:4E:3D:2C:1B:0A"
        },
        "color": "green"
      }
    }]
  */

  // Reformats jsonArray, focusing on ethernet interface data and filtering out errors
  const reformattedArray = jsonArray
    // .filter((obj) => !obj[Object.keys(obj)[0]].error) // Filter out objects with "error" attribute
    .map((obj) => {
      const key = Object.keys(obj)[0]; // The ID of the machine
      const data = obj[key];
      if (data.result) {
        const { cmd, output } = data.result; // cmd is the executed command, output is its stdout
        const ethInterfaces = {};
        // Split the output by new lines, then map each line to a key-value pair under ethInterfaces
        output.split("\n").forEach((line) => {
          const [iface, mac] = line.split(": ");
          ethInterfaces[
            `MAC (NIC-${Object.keys(ethInterfaces).length + 1}) ${iface}`
          ] = mac;
        });
        return {
          [key]: {
            ip: data.ip, // IP address of the machine
            ethernet_interfaces: ethInterfaces, // Formatted ethernet interface data
            color: data.color, // Color coding (e.g., for error status)
          },
        };
      } else {
        return obj; // Return original object if no result data is present
      }
    });

  // Writes the reformatted array to a file if outputFile is specified
  if (outputFile) {
    fs.writeFileSync(outputFile, JSON.stringify(reformattedArray, null, 2));
  }

  return reformattedArray;
}

function checkBoxPosition(dcHardware, jsonArray) {
  if (dcHardware.length !== jsonArray.length) {
    throw new Error("The lengths of DC02_HARDWARE and JSON_ARRAY do not match.");
  }

  // Convert JSON_ARRAY to a lookup table by box ID for faster access
  const jsonArrayLookup = jsonArray.reduce((acc, item) => {
    const key = Object.keys(item)[0];
    acc[key] = item[key];
    return acc;
  }, {});

  const mismatchedBoxes = dcHardware.map(boxData => {
    const boxId = Object.keys(boxData)[0];
    const jsonBoxData = jsonArrayLookup[boxId];
    if (!jsonBoxData) {
      console.error(`Matching entry for ${boxId} not found in JSON_ARRAY.`);
      return null; // Skipping unmatched boxData, might adjust based on requirements
    }

    const ethernetInterfaces1 = boxData[boxId].ethernet_interfaces;
    const ethernetInterfaces2 = jsonBoxData.ethernet_interfaces;

    if (!ethernetInterfaces1 || !ethernetInterfaces2) return null;

    // Combine MAC address processing steps and compare
    const correctMacs = Object.values(ethernetInterfaces1).map(mac => mac.toLowerCase().trim());
    const actualMacs = Object.values(ethernetInterfaces2).map(mac => mac.toLowerCase().trim());

    const isMismatch = !correctMacs.some(mac => actualMacs.includes(mac));
    if (isMismatch) {
      const mismatchedMac = actualMacs.find(mac => !correctMacs.includes(mac)) || actualMacs[0]; // Assuming at least one MAC address is present
      const machineId = findMachineIdByMac(dcHardware, mismatchedMac);
      return {
        [boxId]: {
          correct_macs: ethernetInterfaces1,
          actual_macs: ethernetInterfaces2,
          msg: machineId
            ? `The MAC '${mismatchedMac}' is supposed to be in machine ${machineId}`
            : `No machines on the network have the following NICs: ${mismatchedMac}`
        }
      };
    }
    return null;
  }).filter(box => box !== null); // Remove nulls from mismatches

  return mismatchedBoxes;
}

function findMachineIdByMac(data, mac) {
  // console.log(data[101])
  for (const entry of data) {
    const id = Object.keys(entry)[0];
    const info = entry[id];
    if (info.ethernet_interfaces) {
      const macs = Object.values(info.ethernet_interfaces).map((mac) =>
        mac.toLowerCase().trim()
      );
      if (macs.includes(mac)) {
        return id;
      }
    }
  }
  return 0; // Return 0 if no matching machine ID is found to indicate that no network machines have the given NICs
}

function processExecutionResult(executeResult) {
  const mappedInfo = executeResult.map(({ ip, ...rest }) => {
    const id = generateIdFromIp(ip); // Generate ID based on the IP
    return {
      [id]: { // Use computed property names to set the key
        ip,
        ...rest,
        color: rest.error ? "red" : "green", // Assign color based on error presence
      }
    };
  });

  return mappedInfo;
}

function countRunningMachines(jsonData) {
  let greenCounter = 0;

  // Iterate over each object in the array
  jsonData.forEach(obj => {
    // Iterate over the properties of each object
    Object.values(obj).forEach(value => {
      // Check if the color property is "green"
      if (value.color === "green") {
        greenCounter++;
      }
    });
  });

  return greenCounter;
}
