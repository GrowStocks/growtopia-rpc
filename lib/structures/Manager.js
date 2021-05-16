const os = require("os");
const StateChecker = require("./StateChecker");
const Updater = require("./Updater"); // eslint-disable-line no-unused-vars
const { EventEmitter } = require("events");
const Growtopian = require("./Growtopian");
const RPC = require("discord-rpc");
const firstIndex = 1;

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
    if (!this.overwriteLogging) {
      this.on("log", log => {
        let dumbLog = null;
        if (this.debug) {
          dumbLog = log;
        } else {
          dumbLog = log.split(": ")
            .slice(firstIndex, log.length - firstIndex)
            .join("");
        }
        console.log(dumbLog); // eslint-disable-line no-console
      });
    }

    this.emit("debug", "[Manager]: Setting up...");
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
    this.growtopian.on("saveDatUpdate", this.handleSaveUpdate);

    this.emit("debug", "[Manager]: Fully set up.");
    this.emit("log", `[Manager]: Growtopia Discord Rich Presence (${this.updater.version}) is now running.`);
    this.emit("log", "[Manager]: You can minimize this window if you would like to keep it running.");
    this.emit("log", "[Manager]: Otherwise, to kill the program, close this window.");
    this.emit("log", "[Manager]: If Growtopia and Discord are opened but the Rich Presence is not showing, try completely closing then re-opening Discord.");
    this.emit("log", "[CLI]: --- Introducing /commands!");
    this.emit("log", "[CLI]: You can now type /help to see a list of available commands.");
  }

  handleError(error) {
    this.emit("log", "[Manager]: An error has occured. More information is provided below if you have debugging turned on.");
    this.emit("debug", `[Manager]: Error: ${error}`);
  }

  enableDebug(mode) {
    if (this.debug) return;
    this.debug = mode;
    this.on("debug", console.log); // eslint-disable-line no-console
  }

  disableDebug(mode) {
    if (!this.debug) return;
    this.debug = mode;
    this.removeListener("debug", console.log); // eslint-disable-line no-console
  }

  handleDiscordOpen() {
    this.manager.client = new RPC.Client({ transport: "ipc" });
    this.manager.client.login({ clientId: this.manager.clientId });
    this.manager.emit("debug", "[State Checker]: Discord window state changed to opened.");
  }

  handleDiscordClose() {
    this.manager.emit("debug", "[State  Checker]: Discord window state changed to closed.");
    if (this.manager.client) {
      this.manager.client.destroy()
        .catch(this.manager.handleError)
        .then(() => this.manager.emit("debug", "[RPC]: RPC client has been destroyed."));
    }
    this.manager.client = null;
  }

  async updatePresence(resetTimestamp = true) {
    /**
     * Usually, the state props haven't been updated when the event fires,
     * so we must wait a bit before attempting to update the data, this also
     * ensures that we don't use the I/O operations too fast, risking the
     * corruption of the saves file.
     */
    await this.checker.wait(200); // eslint-disable-line no-magic-numbers
    if (!this.checker.growtopiaOpen) return this.manager.emit("debug", "[State Checker]: Cannot update RPC presence data, growtopia is not running.");
    let presenceData = "";

    if (resetTimestamp) this.growtopian.startedAt = new Date();
    try {
      presenceData = this.growtopian.generatePresenceJson();
    } catch (err) {
      this.emit("log", "[Growtopian]: Failed to fetch presence data.");
      this.handleError(err);
      this.emit("debug", "[Growtopian]: Most likely cannot access the save.dat file.");
    }

    const presencePayload = {
      activity: presenceData,
      pid: process.pid
    };

    this.emit("debug", `[RPC]: Sending acitivty set request with the payload: ${JSON.stringify(presencePayload)}`);
    this.client.request("SET_ACTIVITY", presencePayload)
      .catch(this.handleError)
      .then(payload => this.emit("debug", `[RPC]: Discord responded with payload: ${JSON.stringify(payload)}`));
    return true;
  }

  handleGrowtopiaStart() {
    this.manager.emit("debug", "[State Checker]: Growtopia window state changed to opened.");
    this.manager.growtopian.startedAt = new Date();
    if (!this.manager.client) {
      this.manager.client = new RPC.Client({ transport: "ipc" });
      this.manager.client.login({ clientId: this.manager.clientId });
    }
    this.manager.updatePresence();
  }

  handleGrowtopiaClose() {
    this.manager.emit("debug", "[State Checker, RPC]: Growtopia window state changed to closed, attempting to reset the presence.");
    this.manager.growtopian.startedAt = new Date();
    this.manager.client.request("SET_ACTIVITY", {
      pid: process.pid,
      presence: {}
    }).then(payload => this.manager.emit("debug", `[RPC]: Discord replied with the payload: ${JSON.stringify(payload)}`));
    if (this.manager.closeOnExit) process.exit();
  }

  handleSaveUpdate() {
    this.manager.updatePresence();
  }
}

module.exports = Manager;
