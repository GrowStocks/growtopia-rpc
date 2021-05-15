const Manager = require("../lib/index");

const manager = new Manager({
  clientId: "",
  overwriteLogging: false
});

console.log(`[Manager] Starting with client id ${manager.clientId}.`); // eslint-disable-line no-console
