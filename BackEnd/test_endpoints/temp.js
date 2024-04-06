// import bcrypt from "bcrypt";
// const hashedPassword = await bcrypt.hash('wpkf0224', 10)
// console.log(hashedPassword)


// Import the promises API from the 'fs' module
import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import { isEqual } from 'lodash-es'

async function updateMachineState() {
    const filePath = 'D:/CareMedical/PriceDatabaseUtil/NodeWatchman/BackEnd/test_endpoints/Data/interactive_nodes_updated.json';
  
    try {
      // Read the content of the JSON file
      const jsonContent = await fs.promises.readFile(filePath, 'utf8');
  
      // Set headers
      const headers = {
        'Content-Type': 'application/json'
      };
  
      // Make the POST request with the JSON content directly as the body
      const response = await fetch('http://localhost:3000/update-machine-state', {
        method: 'POST',
        headers,
        body: jsonContent
      });
  
      // Check the response status
      if (response.ok) {
        console.log('Machine state updated successfully.');
      } else {
        console.error(`Failed to update machine state. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating machine state:', error);
    }
}



async function generateUpdateList(currentData, updatedData) {
    const currentStates = JSON.parse(currentData);
    const updatedStates = JSON.parse(updatedData);
    const updatesNeeded = [];

    // Ensure both arrays are of the same length to avoid errors
    if (currentStates.length !== updatedStates.length) {
        console.error("The current and updated states arrays do not match in length.");
        return updatesNeeded;
    }

    // Iterate over the arrays using index
    for (let i = 0; i < currentStates.length; i++) {
        const currentMachineState = currentStates[i];
        const updatedMachineState = updatedStates[i];

        // If data has changed
        if (!isEqual(currentMachineState, updatedMachineState)) {
            // Assuming the structure includes a machineId field or similar to identify the machine
            updatesNeeded.push(updatedMachineState);
        }
    }

    return updatesNeeded;
}

async function compareAndUpdate() {
    try {
        // Specify the encoding directly as the second argument
        const current = await fs.readFile('D:/CareMedical/PriceDatabaseUtil/NodeWatchman/BackEnd/test_endpoints/Data/interactive_nodes_current.json', 'utf8');
        const updated = await fs.readFile('D:/CareMedical/PriceDatabaseUtil/NodeWatchman/BackEnd/test_endpoints/Data/interactive_nodes_updated.json', 'utf8');

        const updatesNeeded = await generateUpdateList(current, updated);
        console.log(updatesNeeded);

        // Now, updatesNeeded contains the necessary changes
    } catch (error) {
        console.error('Error comparing updates:', error);
    }
}

compareAndUpdate();


// Call the function
// updateMachineState();