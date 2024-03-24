const fs = require('fs');

function printMachinesRunningVastAI(filePath) {
  // Read the JSON file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    try {
      // Parse the JSON data
      const machines = JSON.parse(data);

      // Filter for machines running Vast AI and print the output
      machines.forEach(machine => {
        if (machine.result?.output?.includes('is running vastai')) {
          console.log(machine.result.output);
        }
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
}

// Example usage
const filePath = '../SSH-Server/output.json';
printMachinesRunningVastAI(filePath);
