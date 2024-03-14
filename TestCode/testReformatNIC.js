const fs = require('fs');

function reformatJsonArray(jsonArray, outputFile = null) {
    const reformattedArray = jsonArray
        .filter(obj => !obj[Object.keys(obj)[0]].error) // Filter out objects with "error" attribute
        .map(obj => {
            const key = Object.keys(obj)[0];
            const data = obj[key];
            if (data.result) {
                const { cmd, output } = data.result;
                const ethInterfaces = {};
                output.split('\n').forEach(line => {
                    const [iface, mac] = line.split(': ');
                    ethInterfaces[`MAC (NIC-${Object.keys(ethInterfaces).length + 1}) ${iface}`] = mac;
                });
                return {
                    [key]: {
                        ip: data.ip,
                        ethernet_interfaces: ethInterfaces,
                        color: data.color
                    }
                };
            } else {
                return obj;
            }
        });

    if (outputFile) {
        fs.writeFileSync(outputFile, JSON.stringify(reformattedArray, null, 2));
    }

    return reformattedArray;
}

function reformatJsonArray(inputFile = null, outputFile = null) {
    let jsonArray;

    if (inputFile) {
        try {
            const jsonData = fs.readFileSync(inputFile, 'utf8');
            jsonArray = JSON.parse(jsonData);
        } catch (error) {
            console.error(`Error reading input file: ${error.message}`);
            return;
        }
    } else {
        console.error('Input file path is required.');
        return;
    }

    const reformattedArray = jsonArray.map(obj => {
        const key = Object.keys(obj)[0];
        const data = obj[key];
        if (data.result) {
            const { cmd, output } = data.result;
            const ethInterfaces = {};
            output.split('\n').forEach(line => {
                const [iface, mac] = line.split(': ');
                ethInterfaces[`MAC (NIC-${Object.keys(ethInterfaces).length + 1}) ${iface}`] = mac;
            });
            return {
                [key]: {
                    ip: data.ip,
                    ethernet_interfaces: ethInterfaces,
                    color: data.color
                }
            };
        } else {
            return obj;
        }
    });

    if (outputFile) {
        fs.writeFileSync(outputFile, JSON.stringify(reformattedArray, null, 2));
    }

    return reformattedArray;
}
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





// Example usage:
inputFile='../DC02_MACHINE_HARDWARE/DC02_HARDWARE_INFO_ALL.json'
outputFile='./testNodeStatusOutput3.json'
const reformattedArray = reformatJsonIds(inputFile, outputFile);

