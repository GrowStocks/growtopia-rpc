const exec = require('child_process').exec;
const findProcess = require('find-process');
const EventEmitter = require('events');
const fs = require('fs');
const Application = require('../modules/Application.js');

class GrowtopiaHelper extends EventEmitter {
	constructor(){
		super();
		this.clientIsOpen = false;
		this.startedPlaying = new Date();
		this.jammed = false;
		this.appData = Application.device.isMacOS ? `${process.env.HOME}/Library/Application Support/growtopia` : `${process.env.APPDATA}\\..\\Local\\Growtopia`;
		this.splitter = Application.device.isMacOS ? '/' : `\\`

		fs.watchFile(`${this.appData}${this.splitter}save.dat`, (curr, prev) => {
			this.emit("saveDatUpdate");
		});
	}

	async isOpen(){
		if(Application.device.isMacOS) return await this.isOpenMacOS();
		else return await this.isOpenWindows();
	}

	async isOpenWindows(){
		return new Promise((resolve, reject) => {
			exec('tasklist', (err, stdout, stderr) => {
				if(!stdout) resolve(false);
				resolve(stdout.includes("Growtopia.exe"));
			});
		});
	}

	async isOpenMacOS(){
		return new Promise((resolve, reject) => {
			let isFound = findProcess('name', 'Growtopia').then(list => {
				for (let process of list) {
					if (process.name === 'Growtopia') {
						resolve(true);
					}
				}
				resolve(false);
			})
		});
	}

	checkAppStatus(){
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
			fs.readFile(`${this.appData}${this.splitter}save.dat`, 'utf8' , (err, data) => {
				if(err){
					return reject(err);
				}
				resolve(data.replace(/\W/g, ' ').replace(/\s\s+/g, ' ').split(" "));
			});
		});
	}

	async getSaveDatItem(key){
		return new Promise((resolve, reject) => {
			this.readSaveDat().then(data => {
				resolve(data[data.indexOf(key)+1]);
			}).catch(e=>reject(e));
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