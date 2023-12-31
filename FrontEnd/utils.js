const os = require('os');

const getServerIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if ('IPv4' === iface.family && !iface.internal) {
                return iface.address;
            }
        }
    }
};

module.exports = {
    getServerIPAddress,
};

