const { EventEmitter } = require("events");
const { watchFile } = require("fs");
const getSaveDatItem = require("../utils/getSaveDatItem");

class Growtopian extends EventEmitter {
  constructor(manager) {
    super();

    /**
     * The manager instantiating this growtopian.
     * @type {Manager}
     */
    this.manager = manager;

    /**
     * The date the user started playing at.
     * @type {Date}
     */
    this.startedAt = new Date();

    /**
     * Whether the location is turned off.
     * @type {boolean}
     */
    this.jammed = false;

    /**
     * The app data directory.
     * @type {string}
     */
    this.dataPath = this.manager.os.isMacOS
      ? `${process.env.HOME}/Library/Application Support/growtopia/`
      : `${process.env.APPDATA}\\..\\Local\\Growtopia\\`;

    watchFile(`${this.appData}save.dat`, () => {
      this.emit("saveDatUpdate");
    });
  }

  generatePresenceJson() {
    const growId = getSaveDatItem(this.dataPath, "tankid_name") || getSaveDatItem(this.dataPath, "name");
    const worldName = (this.jammed ? "JAMMED!" : getSaveDatItem("lastworld").toUpperCase()) || "EXIT";

    return {
      assets: {
        large_image: "growtopia",
        large_text: "Growtopia",
        small_image: "growstocks",
        small_text: "By GrowStocks"
      },
      buttons: [
        {
          label: "Get Rich Presence",
          url: "https://github.com/GrowStocks/growtopia-rpc/releases/latest"
        },
        {
          label: "Open GrowStocks",
          url: "https://growstocks.xyz"
        }
      ],
      details: `GrowID: ${growId}`,
      state: `World: ${worldName}`,
      timestamps: { start: this.startedAt.getTime() }
    };
  }
}

module.exports = Growtopian;
