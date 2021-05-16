const { version } = require("../../package.json");
const { Request } = require("hclientify");

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
    this.checkForUpdates();
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
      this.manager.emit("log", "[Updater]: See releases tab at https://github.com/GrowStocks/growtopia-rpc.");
      this.manager.emit("log", "[Updater]: -----------");
    }
  }
}

module.exports = Updater;
