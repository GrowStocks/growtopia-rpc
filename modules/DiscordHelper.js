const exec = require('child_process').exec;
const findProcess = require('find-process');
const EventEmitter = require('events');
const System = require('../modules/System.js');

class DiscordHelper extends EventEmitter {
	constructor(){
		super();
		// Discord client status
		this.clientIsOpen = false;
	}

	async isOpen(){
		return await System.processExists('Discord', ["Discord", "Discord PTB", "Discord Canary", "Discord Development", "Discord.exe", "Discord PTB.exe", "Discord Canary.exe", "Discord Development.exe"]);
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
}

module.exports = new DiscordHelper();
