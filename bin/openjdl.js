let commands = {
  generate: { short: "gen" },
  info: {},
  help: {},
};
let cmd = retrieveCommand();

if (cmd) {
  if (Object.keys(commands).includes(cmd)) {
    process.argv.splice(2, 1);
  } else {
    if (cmd === "-v" || cmd === "--version") {
      console.log(require("../package.json").version);
      process.exit(0);
    }

    let { log, warn } = require("../lib/utils/logger");

    if (cmd === "-h" || cmd === "--help") {
      cmd = "help";
    } else if (cmd.indexOf("-") === 0) {
      warn(`Command must come before the options`);
      cmd = "help";
    } else {
      log(
        `Looking for Extension "${process.argv[2]}" command${
          (process.argv[3] && ' "' + process.argv[3] + '"') || ""
        }`
      );

      let exit = process.exit;
      process.exit = (code, reason) => {
        if (reason === "ext-missing") {
          require("./openjdl-help");
          exit(0);
        } else {
          exit(code);
        }
      };

      cmd = "run";
    }
  }
} else {
  cmd = "help";
}

require(`./openjdl-${cmd}`);

function retrieveCommand() {
  let cmd = process.argv[2];

  if (typeof cmd !== "string") {
    return cmd;
  }

  for (let command of Object.keys(commands)) {
    if (commands[command].short === cmd) {
      return command;
    }
  }

  return cmd;
}
