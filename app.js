const {RunnerC, RunnerCpp, RunnerPy3, RunnerJava} = require("./Runners");
const {Runner} = require("./RunnerBase");
const {Utils} = require("./utils");
const fastify = require('fastify')({ignoreTrailingSlash: true});
const uuidv4 = require("uuid/v4");
const fs = require("fs");
const util = require('util');

const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
fastify.get('/api', async() => {
  return "success";
})
fastify.post('/api', async (request) => {
  const {lang, data} = request.body;
  if (!lang || !data) return {success: false};
  let filename = lang === 'java' ? RunnerJava.getFilename(data) : Utils.getFilename(lang);
  console.log(filename);
  if (!filename) return {success: false};

  const random = uuidv4();
  const folder = `${Runner.inputFolderHost}/${random}`;
  await mkdir(folder);

  await writeFile(`${folder}/${filename}`, data);
  let result;
  let success = true;
  try {
    switch (lang) {
      case "python":
        result = await RunnerPy3.execute(folder, random);
        break;
      case "c":
        result = await RunnerC.execute(folder, random);
        break;
      case "cpp":
        result = await RunnerCpp.execute(folder, random);
        break;
      case "java":
        result = await RunnerJava.execute(folder, random, filename);
        break;
    }
  } catch (e) {
    result = e;
    success = false;
  }
  Utils.rmrf(folder);
  return {result, success}
});
const run_c = async () => {
  try {
    const r = await RunnerC.execute();
    console.log(r);
  } catch (e) {
    console.log(e)
  }
};
const run_cpp = async () => {
  try {
    const r = await RunnerCpp.execute();
    console.log(r);
  } catch (e) {
    console.log(e)
  }
};
const run_py3 = async () => {
  try {
    const r = await RunnerPy3.execute();
    console.log(r);
  } catch (e) {
    console.log(e)
  }
};
const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err);
    process.exit(1)
  }
};
start();
