require('dotenv').config();
const fs = require('fs').promises;

async function fetchAndUpdateMachineData() {
    try {
        const url = process.env.REMOVED_RBM_MONITER_API;
        const response = await fetch(url);
        const data = await response.json();

        const processedData = processMachineData(data);
        await fs.writeFile('rbm_nodes.json', JSON.stringify({ boxStates: processedData }, null, 2));
        console.log('Data processed and saved to rbm_nodes.json');
    } catch (error) {
        console.error('Error:', error);
    }
}

function processMachineData(data) {
    const boxStates = {};

    data.forEach(item => {
        const { machinename, online } = item;
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
            const color = getStatusColor(online);

            boxStates[id] = { id, color };
        }
    });

    return boxStates;
}

function getStatusColor(online) {
    return online ? 'green' : 'red';
}

// fetchAndUpdateMachineData();
module.exports = fetchAndUpdateMachineData;
