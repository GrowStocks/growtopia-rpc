const os = require("os");
const RCP = require("./RCP");
const Updater = require("./Updater"); // eslint-disable-line no-unused-vars

class Manager {
  constructor() {
    /**
     * @property The current operation system information.
     */
    this.os = {
      isMacOS: os.platform() === "darwin",
      isWindows: os.platform() === "win32",
      name: os.platform(),
      splitter: os.platform() === "darwin" ? "/" : `\\`
    };

    /**
     * @property The RCP utility for this manager.
     */
    this.rcp = new RCP(this);
  }
}

module.exports = Manager;
