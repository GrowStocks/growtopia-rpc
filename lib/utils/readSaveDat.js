const { readFileSync } = require("fs");
const path = require("path");

function readSaveDat(dataPath) {
  const data = readFileSync(path.join(dataPath, "save.dat"), "utf8");
  return data
    .replace(/\W/gu, " ")
    .replace(/\s\s+/gu, " ")
    .split(" ");
}

module.exports = readSaveDat;
