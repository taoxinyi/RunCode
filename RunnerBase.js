const projectName = "runcode.app";
const baseFolder = `/home/xinyi/${projectName}`;
const inputFolderHost = `${baseFolder}/input`;
const inputFolderContainer = `/${projectName}/input`;
const TimeoutMs = 5000;
const dockerPrefix = 'docker run --rm -m 64M --memory-swap 64M';
const dockerContainerKill = "docker container kill";
const {exec} = require('child_process');

class Runner {
  static get inputFolderHost() {
    return inputFolderHost;
  }

  static get TimeoutMs() {
    return TimeoutMs;
  }

  static get projectName() {
    return projectName;
  }

  static get dockerPrefix() {
    return dockerPrefix;
  }

  static get dockerContainerKill() {
    return dockerContainerKill;
  }

  static async dockerRunAndCleanup(id, cmd) {
    return new Promise(((resolve, reject) => {
      exec(cmd, {timeout: this.TimeoutMs, killSignal: 'SIGKILL'}, (err, stdout, stderr) => {
        if (stderr)
          reject(stderr);
        if (err) {
          if (err.killed) { // timeout
            exec(`${this.dockerContainerKill} ${id}`);   // kill the container
            resolve(stdout + `\nTimeout after ${this.TimeoutMs}ms`);
          } else
            reject(err.message.split('\n').slice(1).join('\n'));
        } else
          resolve(stdout);
      });
    }))

  }
}

module.exports = {Runner};
