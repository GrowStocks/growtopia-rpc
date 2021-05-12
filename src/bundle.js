/////////////////////////////////////////////////////////////////////////////////////////////
////// Ported from https://github.com/AykutSarac/Growtopia-RPC/blob/main/src/bundle.js //////
/////////////////////////////////////////////////////////////////////////////////////////////

const path = require('path');
const fetch = require('node-fetch');

class App {
    constructor(version) {
        this.clientID = "841694148758208542";
        this.version = version;
        this.processTitle = `Growtopia Discord Rich Presence by GrowStocks (${version})`;
    }

    checkForUpdates(){
        fetch(`https://api.github.com/repos/Growstocks/growtopia-rpc/tags`)
        .then(res => res.json())
        .then(data => {
            if(!data || !data[0]) return;
            if(data[0].name != this.version){
                console.log(`[${this.version}] => [${data[0].name}]\nA new update is available for the Growtopia Discord Rich Presence program.\nVisit https://github.com/GrowStocks/growtopia-rpc to get the new version.`);
            }
        })
        .catch(e=>e);
    }
}

const newApp = new App("v1.0");
module.exports = newApp;