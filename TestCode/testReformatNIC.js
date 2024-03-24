const fs = require('fs');

function reformatFile(inputFilePath, outputFilePath) {
    // Read the file
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        // Parse the JSON content
        const originalArray = JSON.parse(data);

        // Reformat the array
        const reformattedArray = originalArray.map(item => {
            const key = Object.keys(item)[0];
            const obj = item[key];
            const ethernet_interfaces = {
                "MAC (NIC-1) enp031f6": obj["MAC (NIC-1) enp031f6"],
                "MAC (NIC-2) enp2s0": obj["MAC (NIC-2) enp2s0"]
            };

            // Remove the NIC entries from the original object
            delete obj["MAC (NIC-1) enp031f6"];
            delete obj["MAC (NIC-2) enp2s0"];

            // Add the ethernet_interfaces object
            obj.ethernet_interfaces = ethernet_interfaces;

            return {
                [key]: obj
            };
        });

        // Write the reformatted array to the output file
        fs.writeFile(outputFilePath, JSON.stringify(reformattedArray, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing the file:', err);
                return;
            }
            console.log(`File has been reformatted and saved to ${outputFilePath}`);
        });
    });
}

function generateFormattedId(machinename) {
    if (machinename.match(/^[ab]\d{4,}/i)) {
        const column = machinename[0].toUpperCase(); // 'A' or 'B'
        const row = machinename[2]; // The first digit (placeholder)
        const machineNumber = parseInt(machinename.substring(4, 6), 10); // The fourth and fifth digits
        let rack;

        if (column === 'A') {
            rack = parseInt(machinename.substring(2, 4), 10); // The second and third digits
        } else {
            rack = parseInt(machinename.substring(1, 4), 10);
        }

        // Format: '<column><row>-<rack>-<machine number>'
        const id = `${column}${row}-${rack}-${machineNumber}`;

        return id;
    }
}

function reformatJsonIds(inputFilePath, outputFilePath) {
    // Read the input file
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        // Parse the JSON data
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return;
        }

        // Process each object to update its ID
        const updatedData = jsonData.map(item => {
            const key = Object.keys(item)[0];
            const newKey = generateFormattedId(key);
            return { [newKey]: item[key] };
        });

        // Write the updated array to the output file
        fs.writeFile(outputFilePath, JSON.stringify(updatedData, null, 2), (writeError) => {
            if (writeError) {
                console.error('Error writing to the file:', writeError);
                return;
            }
            console.log('File has been written with updated IDs.');
        });
    });
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

function findMachineIdByMac(DC02_DATA, mac) {
    //  console.log(DC02_DATA[101])
    for (const entry of DC02_DATA) {
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

//   console.log(findMachineIdByMac(JSON.parse(fs.readFileSync("./DC02_HARDWARE_INFO_ALL.json", 'utf8')), '74:86:e2:13:9e:dd'));


// Function to log the first two and middle two elements of each array object
const logArrayElements = (array) => {
    console.log('First Two:');
    console.log(array[0]);
    console.log(array[1]);

    console.log('Middle Two:');
    const middleIndex = Math.floor(array.length / 2);
    console.log(array[middleIndex]);
    console.log(array[middleIndex + 1]);
};

  
//   console.log('DC02_DATA_ARRAY_OBJ:');
//   logArrayElements(DC02_DATA_ARRAY_OBJ);
  
//   console.log('JSON_ARRAY_OBJ:');
//   logArrayElements(JSON_ARRAY_OBJ);

// DC02_DATA_ARRAY_OBJ=JSON.parse(fs.readFileSync('./DC02_HARDWARE_INFO_ALL.json', 'utf8'))
// JSON_ARRAY_OBJ=JSON.parse(fs.readFileSync('./interactive_nodes.json', 'utf8'))


// console.log(checkBoxPosition(DC02_DATA_ARRAY_OBJ,JSON_ARRAY_OBJ)[0])
const os = require('os');
// Get OS type

function checkOS() {
  const operatingSystem = os.type();

  if (operatingSystem === 'Linux') {
    console.log(`The operating system is: ${operatingSystem}`);
  } else {
    throw new Error('This script is only supported on Linux operating systems.');
  }
}

try {
  checkOS();
} catch (error) {
  console.error(`Error: ${error.message}`);
}
// // Example usage:
// inputFile='../DC02_MACHINE_HARDWARE/DC02_HARDWARE_INFO_ALL.json'
// outputFile='./testNodeStatusOutput3.json'
// const reformattedArray = reformatJsonIds(inputFile, outputFile);

