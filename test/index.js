const fs = require("fs");
const path = require("path");
require("@babel/register");

const packagesDir = path.join(__dirname, "../packages/");

const testFiles = fs
  .readdirSync(packagesDir)
  .map(pkg => path.join(packagesDir, pkg, "test"))
  .filter(p => isDir(p))
  .map(p =>
    fs
      .readdirSync(p)
      .map(file => path.join(p, file))
      .filter(p => isFile(p))
  )
  .reduce((acc, cur) => [...acc, ...cur], []);

for (let file of testFiles) {
  require(file);
}

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch (e) {
    return false;
  }
}
