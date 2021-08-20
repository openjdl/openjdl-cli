let os = require("os");

module.exports.getExternalNetworkInterface = function () {
  let networkInterfaces = os.networkInterfaces();
  let devices = [];

  for (let deviceName of Object.keys(networkInterfaces)) {
    let networkInterface = networkInterfaces[deviceName];

    for (let networkAddress of networkInterface) {
      if (!networkAddress.internal && networkAddress.family === "IPv4") {
        devices.push({ deviceName, ...networkAddress });
      }
    }
  }

  return devices;
};
