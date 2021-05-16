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
      this.emit("log", `[Manager]: The app will close then the growtopia window is closed.`);
    }

    if (process.argv.includes("DEBUG")) {
      this.enableDebug(true);
      this.emit("log", `[Manager]: The app will print additional debug logs.`);
    }

    RPC.register(this.clientId);
    this.checker.on("discordWindowOpen", this.handleDiscordOpen);
    this.checker.on("discordWindowExit", this.handleDiscordClose);
    this.checker.on("growtopiaWindowOpen", this.handleGrowtopiaStart);
    this.checker.on("growtopiaWindowExit", this.handleGrowtopiaClose);

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
    this.manager.client = new RPC.Client({ transport: "ipc" });
    this.manager.client.login({ clientId: this.manager.clientId });
    this.manager.emit("debug", "[Manager]: Discord window state changed to opened.");
  }

  handleDiscordClose() {
    this.manager.emit("debug", "[Manager]: Discord window state changed to closed.");
    if (this.manager.client) this.manager.client.destroy()
      .catch(this.manager.handleError)
      .then(() => this.manager.emit("debug", "[Manager]: RPC client has been destroyed."));
    this.manager.client = null;
  }

  updatePresence() {
    if (!this.growtopiaOpen) return this.manager.emit("[Manager]: Cannot update RPC presence data, growtopia is not running.");
    let presenceData = "";

    try {
      presenceData = this.manager.growtopian.generatePresenceJson();
    } catch (err) {
      this.manager.emit("log", "[Manager]: Failed to fetch presence data.");
      this.manager.handleError(err);
      this.manager.emit("debug", "[Manager]: Most likely cannot access the save.dat file.");
    }

    const presenceData = {
      activity: presenceData,
      pid: process.pid
    };

    this.manager.emit("debug", `[Manager]: Sending acitivty set request with the payload: ${JSON.stringify(presenceData)}`);
    this.manager.client.request("SET_ACTIVITY", presenceData)
      .catch(this.manager.handleError)
      .then(payload => this.manager.emit(`[Manager]: Discord responded with payload: ${JSON.stringify(payload)}`));
  }

  handleGrowtopiaStart() {
    this.manager.emit("debug", "[Manager]: Growtopia window state changed to opened.");
    this.manager.growtopian.startedAt = new Date();
    if (!this.manager.client) {
      this.manager.client = new RPC.Client({ transport: "ipc" });
      this.manager.client.login({ clientId: this.manager.clientId });
    }
    this.manager.updatePresence();
  }

  handleGrowtopiaClose() {
    this.manager.emit("debug", "[Manager]: Growtopia window state changed to closed, attempting to reset the presence.");
    this.manager.growtopian.startedAt = new Date();
    this.manager.client.request("SET_ACTIVITY", {
      pid: process.pid,
      presence: {}
    }).then(payload => `[Manager]: Discord replied with the payload: ${JSON.stringify(payload)}`);
  }
}

module.exports = Manager;
