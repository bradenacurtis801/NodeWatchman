import { isEqual } from 'lodash-es';

/**
 * Compares two arrays of machine states (current and updated) and generates a list of updates needed.
 * 
 * This function assumes that each element in the input arrays represents the state of a machine at the same index,
 * allowing for direct comparison using the array index. It checks for differences between the current and updated 
 * states of each machine and returns a list of the updated machine states that differ from their current states.
 *
 * @param {string} currentData - A JSON string representing an array of the current states of machines.
 * @param {string} updatedData - A JSON string representing an array of the updated states of machines.
 * @returns {Array} updatesNeeded - An array of updated machine states that differ from the current states.
 *
 * Note: It's crucial for both `currentStates` and `updatedStates` to be arrays of the same length,
 * with corresponding indices representing the same machine.
 */
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

export default { generateUpdateList }