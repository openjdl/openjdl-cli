let minimist = require("minimist");
let argv = minimist(process.argv.slice(2), {
  alias: {
    h: "help",
  },
  boolean: ["h"],
});

if (argv.help) {
  console.log(`
  Description
    Displays information about your machine and your OpenJDL CLI.

  Usage
    $ openjdl info

  Options
    --help, -h     Displays this message
  `);
  process.exit(0);
}

let chalk = require("chalk");
let os = require("os");
let spawn = require("cross-spawn").sync;

/**
 * @param {string} command
 * @param {string} ver
 */
function getSpawnOutput(command, ver = "--version") {
  try {
    let child = spawn(command, [ver]);
    let output =
      child.output[1] === null || child.output[1].length === 0
        ? child.output[2]
        : child.output[1];

    return child.status === 0
      ? chalk.green(
          String(output)
            .replace(/[\r\n]/g, " ")
            .trim()
        )
      : chalk.red("Not installed");
  } catch (e) {
    return chalk.red("Not installed");
  }
}

let getExternalNetworkInterface =
  require("../lib/utils/net").getExternalNetworkInterface;
let output = [
  {
    key: "Operating System",
    value: chalk.green(
      `${os.type()}(${os.release()}) - ${os.platform()}/${os.arch()}`
    ),
    section: true,
  },
  { key: "Global packages", section: true },
  {
    key: "  openjdl",
    value: chalk.green(require("../package.json").version),
  },
  { key: "  node", value: chalk.green(process.version.slice(1)) },
  { key: "  npm", value: getSpawnOutput("npm") },
  { key: "  yarn", value: getSpawnOutput("yarn") },
  { key: "  docker", value: getSpawnOutput("docker") },
  { key: "  docker compose", value: getSpawnOutput("docker-compose") },
  { key: "  git", value: getSpawnOutput("git") },
  { key: "  python", value: getSpawnOutput("python") },
  { key: "  ruby", value: getSpawnOutput("ruby", "-v") },
  { key: "  gem", value: getSpawnOutput("gem", "-v") },
  { key: "  java", value: getSpawnOutput("java", "-version") },
  { key: "Networking", section: true },
  { key: "  Host", value: chalk.green(os.hostname()) },
  ...getExternalNetworkInterface().map((it) => ({
    key: `  ${it.deviceName}`,
    value: chalk.green(it.address),
  })),
];

let spaces = output.reduce((acc, v) => Math.max(acc, v.key.length), 0);
console.log(
  output
    .map(
      (it) =>
        `${it.section ? "\n" : ""}${it.key}${" ".repeat(
          spaces - it.key.length
        )}\t${it.value === undefined ? "" : it.value}`
    )
    .join("\n")
);
console.log();
