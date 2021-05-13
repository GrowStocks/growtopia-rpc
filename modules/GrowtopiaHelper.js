const exec = require('child_process').exec;
const findProcess = require('find-process');
const EventEmitter = require('events');
const fs = require('fs');
const System = require('../modules/System.js');

class GrowtopiaHelper extends EventEmitter {
	constructor(){
		super();
		// Growtopia client status
		this.clientIsOpen = false;

		// The timestamp the user started playing on
		this.startedPlaying = new Date();

		// Whether or not location is turned off
		this.jammed = false;

		// App data path
		this.appData = System.os.isMacOS ? `${process.env.HOME}/Library/Application Support/growtopia/` : `${process.env.APPDATA}\\..\\Local\\Growtopia\\`;

		// Start watching save.dat for updates
		fs.watchFile(`${this.appData}save.dat`, (curr, prev) => {
			this.emit("saveDatUpdate");
		});
	}

	async isOpen(){
		return await System.processExists('Growtopia', ['Growtopia', 'Growtopia.exe']);
	}

	async checkAppStatus(){
		let self = this;
		(async function check(){
			let clientIsOpen = await self.isOpen();
			if(clientIsOpen != self.clientIsOpen){
				self.clientIsOpen = clientIsOpen;
				if(clientIsOpen){
					self.emit("start");
				}else{
					self.emit("exit");
				}
			}
			setTimeout(function(){
				check();
			}, 5000);
		})();
	}

	async readSaveDat(){
		return new Promise((resolve, reject) => {
			fs.readFile(`${this.appData}save.dat`, 'utf8' , (err, data) => {
				if(err){
					return reject(err);
				}
				resolve(data.replace(/\W/g, ' ').replace(/\s\s+/g, ' ').split(" "));
			});
		});
	}

	async getSaveDatItem(key){
		return new Promise((resolve, reject) => {
			this.readSaveDat()
			.then(data => {
				// If key does not exist, return false
				if(data.indexOf(key) < 0) resolve(false);

				// Return the key's value
				resolve(data[data.indexOf(key)+1]);
			})
			.catch(e=>reject(e));
		});
	}

	async generateRPCData(){
		return new Promise(async (resolve, reject) => {
			try{
			    resolve({
			        details: `GrowID: ${await this.getSaveDatItem("tankid_name") || await this.getSaveDatItem("name") || "none"}`,
			        state: `World: ${this.jammed ? "JAMMED!" : (await this.getSaveDatItem("lastworld")).toUpperCase() || "EXIT"}`,
			        assets: {
			        	large_image: "growtopia",
				        large_text: "Growtopia",
				        small_image: "growstocks",
				        small_text: "By GrowStocks"
				    },
			        timestamps: {
			        	start: this.startedPlaying.getTime()
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
					]
				});
			}catch(e){
				reject(e);
			}
		});
	}
}

module.exports = new GrowtopiaHelper();