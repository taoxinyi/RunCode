const {Runner} = require("./RunnerBase");
const {Utils} = require("./utils");

class RunnerC extends Runner {
  static get containerName() {
    return 'cpp'
  }

  static get compileRun() {
    return `/bin/sh -c "gcc -Wall ${Utils.getFilename('c')} -o a && ./a >&1 | tee"`
  }

  static async execute(folder, id) {
    const cmd = `${this.dockerPrefix} --name ${id} -v ${folder}:/code -w /code  ${this.containerName} ${this.compileRun}`;
    console.log(cmd);
    return this.dockerRunAndCleanup(id, cmd);

  }
}

class RunnerCpp extends Runner {
  static get containerName() {
    return 'cpp'
  }

  static get compileRun() {
    return `/bin/sh -c "g++ -Wall ${Utils.getFilename('cpp')} -o a && ./a >&1 | tee"`
  }

  static async execute(folder, id) {
    const cmd = `${this.dockerPrefix} --name ${id} -v ${folder}:/code -w /code  ${this.containerName} ${this.compileRun}`;
    console.log(cmd);
    return this.dockerRunAndCleanup(id, cmd);

  }
}

class RunnerPy3 extends Runner {
  static get containerName() {
    return 'python:3.7-alpine'
  }

  static get compileRun() {
    return `python3 -u ${Utils.getFilename('python')}`
  }

  static async execute(folder, id) {
    console.log(1)
    const cmd = `${this.dockerPrefix} --name ${id} -v ${folder}:/code -w /code  ${this.containerName} ${this.compileRun}`;
    console.log(cmd);
    return this.dockerRunAndCleanup(id, cmd);

  }
}

class RunnerJava extends Runner {
  static get classRegex() {
    return /^\s*public class\s+([^\s]+)/m
  }

  static get scriptFile() {
    return `${Runner.inputFolderHost}/runJava.sh`;
  }

  static get containerName() {
    return 'java:alpine'
  }

  static get compileRun() {
    return `sh -c "./runJava.sh`
  }

  static getFilename(data) {
    let filename = Utils.getFilename("java");
    const r = data.match(this.classRegex);
    if (r)
      filename = r[1] + ".java";
    return filename
  }

  static async execute(folder, id, fileName) {
    const cmd = `${this.dockerPrefix} --name ${id} -v ${folder}:/code -w /code -v ${this.scriptFile}:/code/runJava.sh:ro  ${this.containerName} ${this.compileRun} ${fileName}"`;
    console.log(cmd);
    return this.dockerRunAndCleanup(id, cmd);

  }
}

module.exports = {RunnerC, RunnerCpp, RunnerPy3, RunnerJava};
