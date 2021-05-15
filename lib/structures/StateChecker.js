const processExists = require("../utils/processExists");
const { EventEmitter } = require("events");
const { millisecondsInASecond } = require("../utils/constants");
const amounOfSeconds = 5;

class StateChecker extends EventEmitter {
  constructor(manager) {
    super();

    /**
     * The manager that instantiated this instance.
     * @type {Manager}
     */
    this.manager = manager;

    /**
     * Whether the discord app is open or not.
     */
    this.isOpen = false;

    setInterval(this.checkAppState, millisecondsInASecond * amounOfSeconds);
  }

  static async isDiscordOpen() {
    const whetherItExists = await processExists("Discord", [
      "Discord",
      "Discord PTB",
      "Discord Canary",
      "Discord.exe",
      "Discord PTB.exe",
      "Discord Canary.exe"
    ]);
    return whetherItExists;
  }

  async checkAppState() {
    const isOpen = await this.isDiscordOpen();
    if (!isOpen && this.isOpen) this.emit("discordWindowExit");
    else if (isOpen && !this.isOpen) this.emit("discordWindowOpen");
    this.isOpen = isOpen;
  }
}

module.exports = StateChecker;
