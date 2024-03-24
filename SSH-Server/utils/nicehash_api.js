const axios = require('axios');

async function fetchAllData(baseUrl, pageSize = 30) {
  let allRigsDetails = [];

  // Fetch only pages 0, 1, and 2
  for (let page = 0; page <= 2; page++) {
    const url = `${baseUrl}?page=${page}&size=${pageSize}&sort=NAME`;
    try {
      const response = await axios.get(url);
      const rigs = response.data.miningRigs || [];

      const rigsDetails = rigs.map(rig => {
        // Extracting workerName from mmv object as primary source for rig name
        let rigName = rig.v4?.mmv?.workerName;
        // Fallback: Attempt to parse rigName from omv array if not found or format not matched
        if (!rigName || !/a02\d{3}/.test(rigName)) {
          const userSetting = rig.v4?.omv?.find(setting => setting.id === 101); // Assuming ID 101 is for Worker name based on the data structure provided
          rigName = userSetting ? userSetting.value.stringValue : "Unknown Rig Name";
        }
        const minerStatus = rig.minerStatus;
        return { rigName, minerStatus };
      });

      allRigsDetails = allRigsDetails.concat(rigsDetails);

    } catch (error) {
      console.error('Error fetching data for page', page, ':', error);
      // Optionally break the loop if you don't want to attempt further requests after an error
      // break;
    }
  }

  return allRigsDetails;
}

module.exports = fetchAllData


// TESTS //

// const baseUrl = 'https://api2.nicehash.com/main/api/v2/mining/external/bc1qnp2jkflt6xvzt5nclzguhy44jkmmfh5869qn9d/rigs2';
// fetchAllData(baseUrl).then(allRigsDetails => {
//   console.log('Fetched all rigs details:', allRigsDetails, allRigsDetails.length);
//   // Now prints out the array of { rigName, minerStatus } objects
// }).catch(error => {
//   console.error('An error occurred:', error);
// });
