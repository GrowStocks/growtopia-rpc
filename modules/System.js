const fetch = require('node-fetch');
const findProcess = require('find-process');
const EventEmitter = require('events');
const os = require('os');

class System {
    constructor(){
        this.os = {
            name: os.platform(),
            isWindows: os.platform() === 'win32',
            isMacOS: os.platform() === 'darwin',
            splitter: os.platform() === 'darwin' ? '/' : `\\`
        };
    }

    async processExists(wildcard, processes = false){
        return new Promise((resolve, reject) => {
            if(!processes) processes = [wildcard];
            else if(!Array.isArray(processes)) processes = [processes];

            findProcess('name', wildcard).then(list => {
                resolve(list.filter(l => processes.includes(l.name)).length > 0);
            });
        });
    }
}

module.exports = new System();