function generateIdFromIp(ip) {
    const octets = ip.split('.').map(Number);
    if (octets.length !== 4) {
      throw new Error('Invalid IP address format');
    }
  
    const [network1, network2, thirdOctet, machineNumber] = octets;
  
    // Determine if third octet is in the specified range for Section A
    const sectionARange = [11, 12, 13, 14, 21, 22, 23, 24, 25];
    const sectionBRange = [111, 112, 113, 121, 122, 123, 124, 125];
    let section;
    if (sectionARange.includes(thirdOctet)) {
      section = 'A';
    } else if (sectionBRange.includes(thirdOctet)) {
      section = 'B';
    } else {
      section = 'Unknown';
    }
  
    // Determine the number based on the range of the third octet
    let number;
    if ((thirdOctet >= 10 && thirdOctet <= 19) || (thirdOctet >= 100 && thirdOctet <= 109)) {
      number = 1;
    } else if ((thirdOctet >= 20 && thirdOctet <= 29) || (thirdOctet >= 120 && thirdOctet <= 129)) {
      number = 2;
    } else {
      number = 'Unknown'; // Placeholder, adjust as needed
    }
  
    // Construct the ID
    const id = `${section}${number}${thirdOctet}${machineNumber}`;
    return id;
  }
  
  module.exports = {
    generateIdFromIp
  }
