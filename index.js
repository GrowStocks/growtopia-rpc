const Application = require('./modules/Application.js');
const Growtopia = require("./modules/GrowtopiaHelper.js");
const Discord = require("./modules/DiscordHelper.js");
const RPC = require("discord-rpc");
let client,
data = null;

(async function run(){
	// Rename the application title
	process.title = `Growtopia Discord Rich Presence by GrowStocks (${Application.version})`;
	
	// Print the startup notice
	console.log(`Growtopia Discord Rich Presence (${Application.version}) is now running.\nYou can minimize this window if you would like to keep it running.\nOtherwise, to kill the program, close this window.\nIf Growtopia and Discord are opened but the Rich Presence is not showing, try completely closing then re-opening Discord.`)

	// Argument notices
	if(process.argv.includes("ON_CLOSE_EXIT")){
		console.log("This instance is running with the ON_CLOSE_EXIT argument. It will automatically exit when the Growtopia client is closed.")
	}

	if(process.argv.includes("DEBUG")){
		Application.debug = true;
		console.log("This instance is running with the DEBUG argument. Errors will be logged to this console.")
	}

	RPC.register(Application.clientID);

	// Set the user presence
	async function setPresence(){
		try{
			if(Growtopia.clientIsOpen){
				data = await Growtopia.generateRPCData();
				client.request('SET_ACTIVITY', {
					pid: process.pid,
					activity: data
				}).catch(e=>Application.errorHandler(e));
			}
		}catch(e){
			Application.errorHandler(e);
			process.exit(0);
		}
	}

	// When the Discord application starts
	Discord.on('start', () => {
		// Create a new RPC client
		client = new RPC.Client({
		    transport: 'ipc'
		});

		// Login to the client and if successful, set the presence
		client.login({
		    clientId: Application.clientID
		}).then(() => {
			setPresence();
		}).catch(e => {
			setTimeout(() => {
				Discord.emit("start");
			}, 5000);
		});
	});

	// When Discord is closed, destroy the RPC instance
	Discord.on('exit', () => {
		client.destroy().catch(e=>Application.errorHandler(e));
		client = null;
	});

	// When Growtopia is opened
	Growtopia.on('start', () => {
		// Set startedPlaying to now
		Growtopia.startedPlaying = new Date();

		// Create a new RPC client
		client = new RPC.Client({
		    transport: 'ipc'
		});

		// Login to the client and if successful, set the presence
		client.login({
		    clientId: Application.clientID
		}).then(() => {
			setPresence();
		}).catch(e=>Application.errorHandler(e));
	});

	// When Growtopia is closed, clear the Rich Presence or exit the application
	Growtopia.on('exit', () => {
		if(process.argv.includes("ON_CLOSE_EXIT")) return process.exit(0);
		client.clearActivity().catch(e=>Application.errorHandler(e));
	});

	// When the save.dat file is updated
	Growtopia.on('saveDatUpdate', async () => {
		// If Growtopia is closed or the previously fetched data is null, abort
		if(!Growtopia.clientIsOpen || data === null) return;
		
		// Fetch new save.dat data
		Growtopia.generateRPCData().then(newData => {
			// If GrowID or World Name have chanced, set presence again
			if(newData.details != data.details || newData.state != data.state){
				setPresence();
			}
		}).catch(e=>Application.errorHandler(e));
	});

	// Initiate the application watchers
	Growtopia.checkAppStatus();
	Discord.checkAppStatus();
	Application.checkForUpdates();
})();