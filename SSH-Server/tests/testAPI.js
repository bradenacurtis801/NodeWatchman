const config = require('../../Config/config.js');
async function checkNH_Rigs() {
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