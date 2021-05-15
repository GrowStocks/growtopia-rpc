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
     * @type {boolean}
     */
    this.discordOpen = false;

    /**
     * Whether the growtopia app is open or not.
     * @type {boolean}
     */
    this.growtopiaOpen = false;

    this.isGrowtopiaOpen = async() => {
      const whetherItExists = await processExists("Growtopia", [
        "Growtopia",
        "Growtopia.exe"
      ]);
      return whetherItExists;
    };

    this.isDiscordOpen = async() => {
      const whetherItExists = await processExists("Discord", [
        "Discord",
        "Discord PTB",
        "Discord Canary",
        "Discord.exe",
        "Discord PTB.exe",
        "Discord Canary.exe"
      ]);
      return whetherItExists;
    };

    setInterval(function () { // eslint-disable-line
      this.checkAppState();
    }.bind(this), millisecondsInASecond * amounOfSeconds);
  }

  async checkAppState() {
    const isDiscordOpen = await this.isDiscordOpen();
    const isGrowtopiaOpen = await this.isGrowtopiaOpen();

    if (!isDiscordOpen && this.discordOpen) this.emit("discordWindowExit");
    else if (isDiscordOpen && !this.discordOpen) this.emit("discordWindowOpen");

    if (!isGrowtopiaOpen && this.growtopiaOpen) this.emit("growtopiaWindowExit");
    else if (isGrowtopiaOpen && !this.growtopiaOpen) this.emit("growtopiaWindowOpen");

    this.discordOpen = isDiscordOpen;
    this.growtopiaOpen = isGrowtopiaOpen;
  }
}

module.exports = StateChecker;
