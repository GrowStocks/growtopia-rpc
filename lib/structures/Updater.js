const { version } = require("../../package.json");
const {
  millisecondsInASecond,
  minutesInHalfAnHour,
  secondsInAMinute
} = require("../utils/constants");
const { Request } = require("hclientify");
const checkInterval = millisecondsInASecond * minutesInHalfAnHour * secondsInAMinute;
const util = require("util");

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

    this.wait = util.promisify(setTimeout);
    this.init();
  }

  async init() {
    for (let iterator = 0; iterator < Infinity; iterator++) { // eslint-disable-line no-magic-numbers
      await this.checkForUpdates(); // eslint-disable-line no-await-in-loop
      await this.wait(checkInterval); // eslint-disable-line no-await-in-loop
    }
  }

  async checkForUpdates() {
    const releaseRequest = new Request("https://api.github.com/repos/Growstocks/growtopia-rpc/tags")
      .header("Content-Type", "application/json")
      .header("User-Agent", "auto-updater")
      .method("get")
      .send();

    const [latestRelease] = (await releaseRequest).json;
    if (latestRelease.name !== this.version) {
      this.manager.emit("log", "[Updater]: -----------");
      this.manager.emit("log", `[Updater]: A new version is available:  v${this.version} -> ${latestRelease.name}`);
      this.manager.emit("log", "[Updater]: Get the new version at https://github.com/GrowStocks/growtopia-rpc/releases/latest.");
      this.manager.emit("log", "[Updater]: -----------");
    }
  }
}

module.exports = Updater;
