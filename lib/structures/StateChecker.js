const processExists = require("../utils/processExists");
const { EventEmitter } = require("events");
const { millisecondsInASecond } = require("../utils/constants");
const util = require("util");
const amountOfSeconds = 5;

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
        "Discord Development",
        "Discord.exe",
        "Discord PTB.exe",
        "Discord Canary.exe",
        "Discord Development.exe"
      ]);
      return whetherItExists;
    };

    this.wait = util.promisify(setTimeout);
    this.init();
  }

  async init() {
    for (let iterator = 0; iterator < Infinity; iterator++) { // eslint-disable-line no-magic-numbers
      await this.checkAppState(); // eslint-disable-line no-await-in-loop
      await this.wait(millisecondsInASecond * amountOfSeconds); // eslint-disable-line no-await-in-loop
    }
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
