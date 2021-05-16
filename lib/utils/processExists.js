const findProcess = require("find-process");
const listLengthThreshold = 0;

function processExists(wildcard, processes = false) {
  return new Promise(resolve => {
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
