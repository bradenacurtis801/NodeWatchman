document.addEventListener("DOMContentLoaded", () => {
  loadBoxState();
  const runCustomScriptBtn = document.getElementById("runCustomScriptBtn");
  const customScriptModal = document.getElementById("customScriptModal");
  const textareaContainer = document.getElementById("textareaContainer");
  const textareaInput = document.getElementById("textareaInput");
  const closeBtn = customScriptModal.querySelector(".close");
  const startCommandBtn = document.getElementById("startCommand");
  const logoutButton = document.getElementById('logoutBtn');


  runCustomScriptBtn.addEventListener("click", () => {
    customScriptModal.style.display = "block";
    displaySelectedMachines();
  });

  closeBtn.addEventListener("click", () => {
    customScriptModal.style.display = "none";
  });

  window.onclick = (event) => {
    console.log(event.target);
    if (event.target == customScriptModal && !isMouseDownInsideTextarea) {
      customScriptModal.style.display = "none";
    }
  };

  let isMouseDownInsideTextarea = false;

  window.addEventListener("mousedown", (event) => {
    console.log(event.target);
    if (event.target == textareaContainer || event.target == textareaInput) {
      console.log("Mouse down inside textarea");
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

    // Use the manager object to find selected machines
    manager.rows.forEach((row) => {
      row.racks.forEach((rack) => {
        rack.selectedBoxes.forEach((box) => {
          const machineDiv = document.createElement("div");
          machineDiv.textContent = `Machine IP: ${box.ip}`;
          selectedMachinesDiv.appendChild(machineDiv);
        });
      });
    });
  }
  // Add an event listener for the click event on the logout button
  logoutButton.addEventListener('click', async function () {
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
    window.location.href = 'login.html';
  });
  
  startCommandBtn.addEventListener("click", async () => {
  const bashCode = document.getElementById("textareaInput").value;
  const selectedMachines = [];
  manager.rows.forEach((row) => {
    row.racks.forEach((rack) => {
      rack.selectedBoxes.forEach((box) => {
        selectedMachines.push(box.ip);
      });
    });
  });
  const ipsList = selectedMachines.join(",");
  
  console.log("Sending Bash Script and IPs to server:", bashCode, ipsList);
  
  // Example POST request to a server-side endpoint that executes the bash script
  const url = "http://localhost:5000/execute-script";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ips: ipsList, script: bashCode }),
    });
    const result = await response.json();
    console.log("Execution Result:", result);
    displayBashOutput(result);
    console.log("after");
  } catch (error) {
    console.error("Error executing script:", error);
  }
  });
  
  document
  .getElementById("getNodeStatusBtn")
  .addEventListener("click", async () => {
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
  
    try {
      const executeResult = await executeScript(ipsString, bashCode);
  
      const mappedInfo = executeResult.reduce(
        (acc, { ip, ...rest }) => ({
          ...acc,
          [generateIdFromIp(ip)]: {
            ip,
            ...rest,
            color: rest.error ? "red" : "green",
          },
        }),
        {}
      );
  
      console.log("Execution Result:", mappedInfo);
      displayBashOutput(Object.values(mappedInfo));
      const mappedArrayFormatted = reformatJsonArray(Object.values(mappedInfo));
      // Forwarding the response to another endpoint
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
    .filter((obj) => !obj[Object.keys(obj)[0]].error) // Filter out objects with "error" attribute
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

function checkBoxPosition(DC02_HARDWARE, JSON_ARRAY) {
  const mismatchedBoxes = [];

  const p1_data = DC02_HARDWARE;
  const p2_data = JSON_ARRAY;

  for (let i = 0; i < p1_data.length; i++) {
    const boxData1 = p1_data[i];
    const boxData2 = p2_data[i];

    const boxId1 = Object.keys(boxData1)[0];
    const boxId2 = Object.keys(boxData2)[0];

    if (boxId1 !== boxId2) {
      throw new Error(
        `The names do not match: ${boxId1} in p1_data and ${boxId2} in p2_data at index ${i}`
      );
    }

    const boxInfo1 = boxData1[boxId1];
    const boxInfo2 = boxData2[boxId1];

    if (!boxInfo1.ethernet_interfaces || !boxInfo2.ethernet_interfaces)
      continue;

    const correctMacs = Object.values(boxInfo1.ethernet_interfaces).map((mac) =>
      mac.toLowerCase().trim()
    );
    const actualMacs = Object.values(boxInfo2.ethernet_interfaces).map((mac) =>
      mac.toLowerCase().trim()
    );

    // Check if at least one MAC from correct_macs is found in actual_macs
    const isMatchFound = correctMacs.some((mac) => actualMacs.includes(mac));

    if (!isMatchFound) {
      // If no matching MAC is found, append to mismatchedBoxes
      const mismatchedMac = correctMacs.find(
        (mac) => !actualMacs.includes(mac)
      ); // Assuming you still want to report the first non-matching MAC
      const machineId = findMachineIdByMac(p1_data, mismatchedMac);
      mismatchedBoxes.push({
        [boxId1]: {
          correct_macs: boxInfo1.ethernet_interfaces,
          actual_macs: boxInfo2.ethernet_interfaces,
          msg:
            machineId === 0
              ? `No machines on the network have the following NICs: ${mismatchedMac}`
              : `The mac '${mismatchedMac}' is supposed to be in machine ${machineId}`,
        },
      });
    }
  }

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
