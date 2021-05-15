const Application = require("./modules/Application.js");
const Growtopia = require("./modules/GrowtopiaHelper.js");
const Discord = require("./modules/DiscordHelper.js");
const RPC = require("discord-rpc");
let client,
  data = null;

(async function run() {

  // Set the user presence
  async function setPresence() {
    if (Growtopia.clientIsOpen) {
      Growtopia.generateRPCData()
        .then(rpc => {
          data = rpc;
          client.request("SET_ACTIVITY", {
            pid: process.pid,
            activity: rpc
          }).catch(e => Application.errorHandler(e));
        })
        .catch(e => {
          // Most likely, save.dat couldn't be accessed
          Application.errorHandler(e);
          process.exit(0);
        });
    }
  }

  // When the Discord application starts
  Discord.on("start", () => {
    // Create a new RPC client
    client = new RPC.Client({ transport: "ipc" });

    // Login to the client and if successful, set the presence
    client.login({ clientId: Application.clientID })
      .then(() => {
        setPresence();
      })
      .catch(e => {
        Application.errorHandler(e);
        setTimeout(() => {
          Discord.emit("start");
        }, 5000);
      });
  });

  // When Discord is closed, destroy the RPC instance
  Discord.on("exit", () => {
    client.destroy().catch(e => Application.errorHandler(e));
    client = null;
  });

  // When Growtopia is opened
  Growtopia.on("start", () => {
    // Set startedPlaying to now
    Growtopia.startedPlaying = new Date();

    // Create a new RPC client
    client = new RPC.Client({ transport: "ipc" });

    // Login to the client and if successful, set the presence
    client.login({ clientId: Application.clientID })
      .then(() => {
        setPresence();
      })
      .catch(e => Application.errorHandler(e));
  });

  // When Growtopia is closed, clear the Rich Presence or exit the application
  Growtopia.on("exit", () => {
    if (process.argv.includes("ON_CLOSE_EXIT")) return process.exit(0);
    client.clearActivity().catch(e => Application.errorHandler(e));
  });

  // When the save.dat file is updated
  Growtopia.on("saveDatUpdate", async() => {
    // If Growtopia is closed or the previously fetched data is null, abort
    if (!Growtopia.clientIsOpen || data === null) return;

    // Fetch new save.dat data
    Growtopia.generateRPCData()
      .then(newData => {
        // If GrowID or World Name have chanced, set presence again
        if (newData.details != data.details || newData.state != data.state) setPresence();
      })
      .catch(e => Application.errorHandler(e));
  });

  // Support for command line input
  const stdin = process.openStdin();
  stdin.addListener("data", d => {
	    let input = d.toString().trim()
      .split(":");
    if (input[0] == "exec") {
	    	input.shift();
	    	return eval(input.join(":"));
	    }
	    input = input.join(":").toLowerCase()
      .split(":");
	    if (input[0] == "location" && input[1]) {
	    	if (input[1] === "off") Growtopia.jammed = true;
	    	 else Growtopia.jammed = false;

	    	setPresence();
	    	console.log(`Your location has been turned ${Growtopia.jammed ? "off" : "on"}.`);
	    } else if ((input[0] == "debug" || input[0] == "debugging") && input[1]) {
	    	if (input[1] === "on") Application.debug = true;
	    	 else Application.debug = false;

	    	console.log(`Debugging mode has been turned ${Application.debug ? "on" : "off"}.`);
	    }
  });

  // Initiate the application watchers
  Growtopia.checkAppStatus();
  Discord.checkAppStatus();
  Application.checkForUpdates();
}());


// Make sure all errors are handled, even uncaught ones
process.on("uncaughtException", e => {
  console.log("An error has occured. More information is provided below if you have debugging turned on.");
  try {
  	Application.errorHandler(e);
  } catch (e) {
  	// Make sure we don't go into an infinite loop if Application.errorHandler throws an exception
  }
});

