const { Manager } = require("../lib/index");

const manager = new Manager({
  clientId: "841694148758208542",
  overwriteLogging: false
});

process.title = `Growtopia Discord Rich Presence by GrowStocks (${manager.updater.version})`;

/*
 * process.on("unhandledRejection", err => {
 *  manager.emit("log", "[Manager]: Process thrown an unhandled rejection.");
 *  manager.emit("debug", `[Manager]: Unhandled rejection: ${err}`);
 *});
 *
 *process.on("warning", err => {
 *manager.emit("log", "[Manager]: Process warning encountered.");
 *manager.emit("debug", `[Manager]: Process warning: ${err}`);
 *});
 */

console.log(`[Manager]: Starting with client id ${manager.clientId}.`); // eslint-disable-line no-console
