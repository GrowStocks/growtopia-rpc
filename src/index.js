const { Manager } = require("../lib/index");

const manager = new Manager({
  clientId: "841694148758208542",
  overwriteLogging: false
});

process.title = `Growtopia Rich Presence by GrowStocks v${manager.updater.version}`;
process.on("unhandledRejection", manager.handleError);
process.on("warning", manager.handleError);

const stdin = process.openStdin();
stdin.on("data", data => {
  let input = data && data.toString() ? data.toString().trim() : "";
  if (!input.startsWith("/")) return;

  input = input.replace(/\//gu, "");
  const args = input.split(/ +/gu);
  const command = args.shift();

  switch (command) {
    case "help":
      manager.emit("log", "[CLI]: Available commands:");
      manager.emit("log", "[CLI]: /help -  Check the list of available commands.");
      manager.emit("log", "[CLI]: /location <on/off> - Toggles your location visibility.");
      manager.emit("log", "[CLI]: /debug - Turns on the debug logging mode.");
      break;
    case "location":
      manager.growtopian.jammed = args[0] === "off";
      manager.updatePresence(false);
      manager.emit("log", `[CLI]: Your location is now ${manager.growtopian.jammed ? "hidden" : "shown to the public"}.`);
      break;
    case "debug":
      if (manager.debug) {
        manager.disableDebug(false);
        manager.emit("log", "[CLI]: The debug mode has been disabed.");
      } else {
        manager.enableDebug(true);
        manager.emit("log", "[CLI]: The debug mode has been enabled.");
      }
      break;
    default:
      manager.emit("log", "[CLI]: Unrecognized command, use /help to check available commands.");
      break;
  }
});
