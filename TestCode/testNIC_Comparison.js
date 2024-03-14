const fs = require('fs');


function checkBoxPosition(DC02_HARDWARE, JSON_ARRAY) {
    const mismatchedBoxes = [];

    const p1_data = JSON.parse(fs.readFileSync(DC02_HARDWARE, 'utf8'));
    const p2_data = JSON.parse(fs.readFileSync(JSON_ARRAY, 'utf8'));

    for (let i = 0; i < p1_data.length; i++) {
        const boxData1 = p1_data[i];
        const boxData2 = p2_data[i];
        
        const boxId1 = Object.keys(boxData1)[0];
        const boxId2 = Object.keys(boxData2)[0];

        if (boxId1 !== boxId2) {
            throw new Error(`The names do not match: ${boxId1} in p1_data and ${boxId2} in p2_data at index ${i}`);
        }

        const boxInfo1 = boxData1[boxId1];
        const boxInfo2 = boxData2[boxId1];
        
        if (!boxInfo1.ethernet_interfaces || !boxInfo2.ethernet_interfaces) continue;

        const correctMacs = Object.values(boxInfo1.ethernet_interfaces).map(mac => mac.toLowerCase().trim());
        const actualMacs = Object.values(boxInfo2.ethernet_interfaces).map(mac => mac.toLowerCase().trim());

        // Check if at least one MAC from correct_macs is found in actual_macs
        const isMatchFound = correctMacs.some(mac => actualMacs.includes(mac));

        if (!isMatchFound) { // If no matching MAC is found, append to mismatchedBoxes
            const mismatchedMac = correctMacs.find(mac => !actualMacs.includes(mac)); // Assuming you still want to report the first non-matching MAC
            const machineId = findMachineIdByMac(p1_data, mismatchedMac);
            mismatchedBoxes.push({
                [boxId1]: {
                    correct_macs: boxInfo1.ethernet_interfaces,
                    actual_macs: boxInfo2.ethernet_interfaces,
                    msg: machineId === 0 ? `No machines on the network have the following NICs: ${mismatchedMac}` : `The mac '${mismatchedMac}' is supposed to be in machine ${machineId}`
                }
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
            const macs = Object.values(info.ethernet_interfaces).map(mac => mac.toLowerCase().trim());
            if (macs.includes(mac)) {
                return id;
            }
        }
    }
    return 0; // Return 0 if no matching machine ID is found to indicate that no network machines have the given NICs
}

const firstJsonArray = './mismatchArr1.json';
const secondJsonArray = './mismatchArr2.json';

const mismatchedBoxes = checkBoxPosition(secondJsonArray,firstJsonArray);
console.log(mismatchedBoxes[1]);


console.log(findMachineIdByMac(JSON.parse(fs.readFileSync("./mismatchArr2.json", 'utf8')), '74:86:e2:13:b2:80'));