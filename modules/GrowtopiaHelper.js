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
			        state: `World: ${(await this.getSaveDatItem("lastworld")).toUpperCase() || "EXIT"}`,
			        largeImageKey: "growtopia",
			        largeImageText: "Growtopia",
			        smallImageKey: "growstocks",
			        smallImageText: "By GrowStocks",
			        startTimestamp: this.startedPlaying
				});
			}catch(e){
				reject(e);
			}
		});
	}
}

module.exports = new GrowtopiaHelper();