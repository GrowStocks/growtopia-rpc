const os = require("os");
const StateChecker = require("./StateChecker");
const Updater = require("./Updater"); // eslint-disable-line no-unused-vars
const { EventEmitter } = require("events");
const Growtopian = require("./Growtopian");
const RPC = require("discord-rpc");

class Manager extends EventEmitter {
  constructor({ clientId, overwriteLogging }) {
    super();

    /**
     * The current operation system information.
     * @type {object}
     */
    this.os = {
      isMacOS: os.platform() === "darwin",
      isWindows: os.platform() === "win32",
      name: os.platform()
    };

    /**
     * The RCP utility for this manager.
     * @type {RPC}
     */
    this.checker = new StateChecker(this);

    /**
     * The updater utility for this manager.
     * @type {Updater}
     */
    this.updater = new Updater(this);

    /**
     * The growtopia utility for this manager.
     * @type {Growtopian}
     */
    this.growtopian = new Growtopian(this);

    /**
     * The discord client id.
     * @type {string}
     */

    this.clientId = clientId;

    /**
     * Whether the user overwrite the native logger.
     * @type {boolean}
     */
    this.overwriteLogging = overwriteLogging || false;

    /**
     * Whether the debug is enabled for this instance or not.
     * @type {boolean}
     */
    this.debug = false;

    /**
     * Whether to close on growtopia window exit.
     * @type {boolean}
     */
    this.closeOnExit = false;

    /**
     * The RPC client for this manager.
     * @type {RPCClient}
     */
    this.client = null;

    this.init();
  }

  init() {
    if (!this.overwriteLogging) this.on("log", console.log); // eslint-disable-line no-console
    this.emit("log", "[Manager]: Setting up...");

    if (process.argv.includes("ON_CLOSE_EXIT")) {
      this.closeOnExit = true;
      this.emit("log", `[Manager]: Launched with ON_CLOSE_EXIT, the app will close then the growtopia window is closed.`);
    }

    if (process.argv.includes("DEBUG")) {
      this.enableDebug(true);
      this.emit("log", `[Manager]: Launched with DEBUG, the app will print additional debug logs.`);
    }

    RPC.register(this.clientId);
    this.checker.on("discordWindowOpen", this.handleDiscordOpen);
    this.checker.on("discordWindowExit", this.handleDiscordClose);
    this.checker.on("growtopiaWindowOpen", this.handleGrowtopiaStart);

    this.emit("log", "[Manager]: Fully set up.");
  }

  handleError(error) {
    this.emit("log", "[Manager]: An error has occured.");
    this.emit("debug", `[Manager]: Error: ${error}`);
  }

  enableDebug(mode) {
    if (this.debug) return;
    this.debug = mode;
    this.on("debug", console.log); // eslint-disable-line no-console
  }

  handleDiscordOpen() {
    this.client = new RPC.Client({ transport: "ipc" });
    this.client.login({ clientId: this.clientId });
    this.emit("log", "[Manager]: Discord window is open.");
  }

  handleDiscordClose() {
    if (this.client) this.client.destroy().catch(this.handleError);
    this.client = null;
  }

  updatePresence() {
    if (!this.checker.growtopiaOpen) return;
    let presenceData = "";

    try {
      presenceData = this.growtopian.generatePresenceJson();
    } catch (err) {
      this.emit("log", "[Manager]: Failed to fetch presence data.");
      this.handleError(err);
      this.emit("debug", "[Manager]: Most likely cannot access the save.dat file.");
    }

    this.client.request("SET_ACTIVITY", {
      activity: presenceData,
      pid: process.pid
    }).catch(this.handleError);
  }

  handleGrowtopiaStart() {
    this.growtopian.startedAt = new Date();
    if (!this.client) {
      this.client = new RPC.Client({ transport: "ipc" });
      this.client.login({ clientId: this.clientId });
    }
    this.updatePresence();
  }
}

module.exports = Manager;
