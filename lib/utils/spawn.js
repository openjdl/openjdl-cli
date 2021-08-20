let { log, fatal } = require("./logger");
let spawn = require("cross-spawn");

module.exports = function (cmd, params, cwd) {
  params = params || [];
  cwd = cwd || process.cwd();

  log(`Running 「${cmd} ${params.join(" ")}」`);
  console.log();

  const runner = spawn.sync(cmd, params, {
    stdio: "inherit",
    stdout: "inherit",
    stderr: "inherit",
    cwd,
    shell: true,
  });

  if (runner.status || runner.error) {
    console.log();
    fatal(
      `⚠️  Command 「${cmd}」 in ${
        cwd || process.cwd()
      } failed with exit code: ${runner.status}`
    );
  }
};
