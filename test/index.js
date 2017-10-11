import fs from "fs";
import path from "path";

const packagesDir = path.join(__dirname, "../packages/");

const testFiles = fs
  .readdirSync(packagesDir)
  .map(pkg => path.join(packagesDir, pkg, "test"))
  .filter(p => isDir(p))
  .map(p => fs.readdirSync(p).map(file => path.join(p, file)))
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
