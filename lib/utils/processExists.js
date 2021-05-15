const findProcess = require("find-process");
const listLengthThreshold = 0;

function processExists(wildcard, processes = false) {
  return new Promise(resolve => {
    /**
     * can't tell what this does, but you should never
     * re-assign a function argument variable,
     * this is an intermediary variable to use instead
     * TO-DO: fix this
     */
    let deltaProcesses = [];
    if (!processes) deltaProcesses = [wildcard];
    else if (!Array.isArray(processes)) deltaProcesses = [processes];
    else deltaProcesses = processes;

    findProcess("name", wildcard).then(list => {
      resolve(list.filter(childList => deltaProcesses.includes(childList.name)).length > listLengthThreshold);
    });
  });
}

module.exports = processExists;
