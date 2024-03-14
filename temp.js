function setIp(newIp) {
    const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/; // Regular expression for IPv4 validation
    if (ipRegex.test(newIp)) {
        return newIp;
    } else {
        console.error("Invalid IPv4 address format");
        // Optionally, you can throw an error or handle the invalid input differently
    }
}

console.log(setIp('255.255.255.255'))