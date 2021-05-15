const { version } = require("../../package.json");
const {
  millisecondsInASecond,
  minutesInHalfAnHour,
  secondsInAMinute
} = require("../utils/constants");
const { request } = require("hclientify");

const checkInterval = millisecondsInASecond * minutesInHalfAnHour * secondsInAMinute;

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

    setInterval(() => {
      this.checkForUpdates()
        .catch(error => {
          this.manager.emit("log", "[Updater] Failed to fetch the GitHub releases.");
          this.manager.emit("debug", `[Updater] Error: ${error}`);
        });
    }, checkInterval);
  }

  static async checkForUpdates() {
    const [latestRelease] = (await request("https://api.github.com/repos/Growstocks/growtopia-rpc/tags").send()).json;
    if (latestRelease.name !== this.version) {
      this.manager.emit("log", "-----------");
      this.manager.emit("log", `[Updater] A new version is available: ${this.version} -> ${latestRelease.name}\n[Updater] See releases tab at: https://github.com/GrowStocks/growtopia-rpc`);
      this.manager.emit("log", "-----------");
    }
  }
}

module.exports = Updater;
