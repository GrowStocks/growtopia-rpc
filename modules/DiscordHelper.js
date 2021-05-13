const findProcess = require('find-process');
const EventEmitter = require('events');

class DiscordHelper extends EventEmitter {
	constructor(){
		super();
		this.clientIsOpen = false;
	}

	async isOpen(){
		return new Promise((resolve, reject) => {
			let isFound = findProcess('name', 'Discord').then(list => {
				for (let ver of ['', ' PTB', ' Canary']) {
					for (let process of list) {
						if (process.name === 'Discord' + ver) {
							// console.log('[DEBUG] - Found ' + 'Discord' + ver);
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