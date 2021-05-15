const { Manager } = require("../lib/index");

const manager = new Manager({
  clientId: "841694148758208542",
  overwriteLogging: false
});

process.title = `Growtopia Discord Rich Presence by GrowStocks (${manager.updater.version})`;
process.on("unhandledRejection", manager.handleError);
process.on("warning", manager.handleError);
