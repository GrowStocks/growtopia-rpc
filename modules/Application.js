const path = require('path');
const fetch = require('node-fetch');
var os = require('os');

class Application {
    constructor() {
        this.clientID = "841694148758208542";
        this.version = "v1.3.1";
        this.device = {
            isMacOS: os.platform() === 'darwin'
        };
    }

    checkForUpdates(){
        fetch(`https://api.github.com/repos/Growstocks/growtopia-rpc/tags`)
        .then(result => result.json())
        .then(response => {
            if(!response || !response[0] || response[0].name == this.version) return;
            console.log(`[${this.version}] => [${response[0].name}]\nA new update is available for the Growtopia Discord Rich Presence program.\nVisit https://github.com/GrowStocks/growtopia-rpc to get the new version.`);
        })
        .catch(e=>e);
    }
}

module.exports = new Application();