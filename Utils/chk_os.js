import os from 'os';

function checkOS() {
    // UNCOMMENT FOR DEBUGGING PURPOSES
    ////////////////////////////////////////
    return
    ////////////////////////////////////////
    const operatingSystem = os.type();
  
    if (operatingSystem === 'Linux') {
      console.log(`The operating system is: ${operatingSystem}`);
    } else {
      throw new Error('This script is only supported on Linux operating systems.');
    }
  }

export default checkOS