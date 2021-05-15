const os = require("os");
const RPC = require("./RPC");
const Updater = require("./Updater"); // eslint-disable-line no-unused-vars
const { EventEmitter } = require("events");

class Manager extends EventEmitter {
  constructor({ debug, clientId, overwriteLogging }) {
    super();

    /**
     * The current operation system information.
     * @type {object}
     */
    this.os = {
      isMacOS: os.platform() === "darwin",
      isWindows: os.platform() === "win32",
      name: os.platform(),
      splitter: os.platform() === "darwin" ? "/" : `\\`
    };

    /**
     * The RCP utility for this manager.
     * @type {RPC}
     */
    this.rcp = new RPC(this);

    /**
     * The updater utility for this manager.
     * @type {Updater}
     */
    this.updater = new Updater();

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
    this.debug = debug;

    this.init();
  }

  init() {
    if (!this.overwriteLogging) {
      this.client.on("log", console.log); // eslint-disable-line no-console
      if (this.debug) this.client.on("debug", console.log); // eslint-disable-line no-console
    }
    this.client.emit("log", "[Manager] Starting...");
  }
}

module.exports = Manager;
