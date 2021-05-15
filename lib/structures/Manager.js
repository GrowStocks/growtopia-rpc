const os = require("os");
const StateChecker = require("./StateChecker");
const Updater = require("./Updater"); // eslint-disable-line no-unused-vars
const { EventEmitter } = require("events");
const Growtopian = require("./Growtopian");

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

    this.init();
  }

  init() {
    if (!this.overwriteLogging) this.client.on("log", console.log); // eslint-disable-line no-console
    this.client.emit("log", "[Manager] Setting up...");
  }

  enableDebug(mode) {
    if (this.debug) return;
    this.debug = mode;
    this.client.on("debug", console.log); // eslint-disable-line no-console
  }
}

module.exports = Manager;
