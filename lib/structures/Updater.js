const { version } = require("../../package.json");

class Updater {
  constructor(manager) {
    /**
     * The manager that instantiated this updater.
     * @type {Manager}
     */
    this.manager = manager;

    /**
     * The package version.
     * @type {string}
     */
    this.version = version;
  }
}

module.exports = Updater;
