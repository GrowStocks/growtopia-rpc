const exec = require('child_process').exec;
const EventEmitter = require('events');

class DiscordHelper extends EventEmitter {
	constructor(){
		super();
		this.clientIsOpen = false;
	}

	async isOpen(){
		return new Promise((resolve, reject) => {
			exec('tasklist', (err, stdout, stderr) => {
				if(!stdout) resolve(false);
				resolve(stdout.includes("Discord.exe"));
			});
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

module.exports = DiscordHelper;