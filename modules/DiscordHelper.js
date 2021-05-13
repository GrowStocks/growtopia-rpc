const exec = require('child_process').exec;
const findProcess = require('find-process');
const EventEmitter = require('events');
const Application = require('../modules/Application.js');

class DiscordHelper extends EventEmitter {
	constructor(){
		super();
		this.clientIsOpen = false;
	}

	async isOpen(){
		if(Application.device.isMacOS) return await this.isOpenMacOS();
		else return await this.isOpenWindows();
	}

	async isOpenWindows(){
		return new Promise((resolve, reject) => {
			exec('tasklist', (err, stdout, stderr) => {
				if(!stdout) resolve(false);
				resolve(stdout.includes("Discord.exe") || stdout.includes("Discord PTB.exe") || stdout.includes("Discord Canary.exe"));
			});
		});
	}

	async isOpenMacOs(){
		return new Promise((resolve, reject) => {
			let isFound = findProcess('name', 'Discord').then(list => {
				for (let ver of ['', ' PTB', ' Canary']) {
					for (let process of list) {
						if (process.name === 'Discord' + ver) {
							return true;
						}
					}
				}
				return false;
			})
			resolve(isFound);
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
}

module.exports = new DiscordHelper();
