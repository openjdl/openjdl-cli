let minimist = require("minimist");
let argv = minimist(process.argv.slice(2), {
  alias: {
    b: "branch",
    k: "kit",
    c: "clone",
    o: "offline",
    t: "token",
    h: "help",
  },
  boolean: ["c", "o", "h"],
  string: ["k", "b", "t"],
});

if (argv.help) {
  console.log(`
  Description
    Generate files from template
    
  Usage
    $ openjdl generate [--kit <kit-name>] [--branch <version-name>]
    $ openjdl gen [--kit <kit-name>] [--branch <version-name>]
    
  Options
    --kit, -k      Use specific kit
    --branch, -b   Use specific branch of the kit
    --clone, -c    Use git clone
    --offline, -o  Use a cached kit
    --token, -t    Gitlab private token
    --help, -h     Displays help message
  `);
  process.exit(0);
}

const download = require("download-git-repo");
const exists = require("fs").existsSync;
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");
const home = require("user-home");
const tildify = require("tildify");
const inquirer = require("inquirer");
const rm = require("rimraf").sync;
const generate = require("../lib/generate/generate");
const logger = require("../lib/utils/logger");
const { isLocalPath, getTemplatePath } = require("../lib/utils/local-path");

let template = argv.kit
  ? argv.kit.indexOf("/") > -1
    ? argv.kit
    : `openjdl/openjdl-generate-kit-${argv.kit}`
  : "openjdl/openjdl-generate-kit";
let rawName = argv._[0];
let inPlace = !rawName || rawName === ".";
let name = inPlace ? path.relative("../", process.cwd()) : rawName;
let to = path.resolve(rawName || ".");

if (isLocalPath(template) !== true) {
  template += `#${argv.branch || "main"}`;
}

let tmp = path.join(
  home,
  ".openjdl",
  "generate-kit",
  template.replace(/[\/:]/g, "-")
);
if (argv.offline) {
  console.log(`> Use cached template at ${chalk.yellow(tildify(tmp))}`);
  template = tmp;
}

console.log();
process.on("exit", () => console.log());

if (inPlace || exists(to)) {
  inquirer
    .prompt([
      {
        type: "confirm",
        message: inPlace
          ? `Generate in current directory '${to}'?`
          : `Target directory '${to}' exists. Continue?`,
        name: "ok",
      },
    ])
    .then((answers) => {
      if (answers.ok) {
        run();
      }
    })
    .catch(logger.fatal);
} else {
  run();
}

function run() {
  if (isLocalPath(template) !== true) {
    downloadAndGenerate();
    return;
  }

  let templatePath = getTemplatePath(template);
  if (exists(templatePath)) {
    generate(name, templatePath, to, (err) => {
      if (err) {
        logger.fatal(err);
      }
      console.log();
      logger.success(`Generated "${name}".`);
    });
  } else {
    logger.fatal(`Local template "${templatePath}" not found.`);
  }
}

function downloadAndGenerate() {
  const logMessage = `Downloading generate kit "${template}" to "${tmp}"`;
  const spinner = ora(` Downloading`);

  logger.info(logMessage);
  spinner.start();

  if (exists(tmp)) {
    rm(tmp);
  }

  let opts = {
    clone: argv.clone,
  };

  if (typeof argv.token === "string") {
    opts.headers = {
      "PRIVATE-TOKEN": "1234",
    };
  }

  download(template, tmp, opts, (err) => {
    spinner.stop();

    if (err) {
      logger.fatal(
        "Failed to download repo " + template + ": " + err.message.trim()
      );
    }

    generate(name, tmp, to, (err) => {
      if (err) {
        logger.fatal(err);
      }

      console.log();
      logger.success(`Generated "${name}".`);
    });
  });
}
