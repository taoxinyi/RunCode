const {exec} = require('child_process');
const fileTable = {
  python: "file.py",
  c: "file.c",
  cpp: "file.cpp",
  java: "file.java"
};

class Utils {
  static async rmrf(folder) {
    exec(`rm -rf ${folder}`);
  }

  static getFilename(language) {
    return fileTable[language];
  }
}

module.exports = {Utils};
