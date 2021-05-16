const readSaveDat = require("./readSaveDat");
const nonExistentIndex = 0;
const addedIndex = 1;

function getSaveDatItem(dataPath, key) {
  const data = readSaveDat(dataPath);
  if (data.indexOf(key) < nonExistentIndex) return false;
  return data[data.indexOf(key) + addedIndex];
}

module.exports = getSaveDatItem;
