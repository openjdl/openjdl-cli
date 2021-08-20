let minimist = require("minimist");
let argv = minimist(process.argv.slice(2), {
  alias: {
    b: "branch",
    k: "kit",
    c: "clone",
    o: "offline",
    h: "help",
  },
  boolean: ["c", "o", "h"],
  string: ["k", "b"],
});

if (argv.help) {
  console.log(`
  Description
    Generate file from template
    
  Usage
    $ openjdl generate [--kit <kit-name>] [--branch <version-name>]
    $ openjdl gen [--kit <kit-name>] [--branch <version-name>]
    
  Options
    --kit, -k      Use specific starter kit
    --branch, -b   Use specific branch of the starter kit
    --clone, -c    Use git clone
    --offline, -o  Use a cached starter kit
    --help, -h     Displays this message
  `);
  process.exit(0);
}

let download = require("download-git-repo");
let exists = require("fs").existsSync;
let path = require("path");
let ora = require("ora");
let chalk = require("chalk");
let home = require("user-home");
let tildify = require("tildify");
let inquirer = require("inquirer");
let rm = require("rimraf").sync;
let generate = require("../lib/generate");
let logger = require("../lib/utils/logger");
let { isLocalPath, getTemplatePath } = require("../lib/utils/local-path");

let defaultTemplate = "openjdl/template-generate-";
let template = argv.kit
  ? argv.kit.indexOf("/") > -1
    ? argv.kit
    : `${defaultTemplate}-${argv.kit}`
  : defaultTemplate;

let rawName = argv._[0];
let inPlace = !rawName || rawName === ".";
let name = inPlace ? path.relative("../", process.cwd()) : rawName;
let to = path.resolve(rawName || ".");

if (isLocalPath(template) === true) {
  template += `#${argv.branch || "master"}`;
}

let tmp = path.join(
  home,
  ".openjdl-template-generate",
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
          ? "Generate project in current directory?"
          : "Target directory exists. Continue?",
        name: "ok",
      },
    ])
    .then((answers) => {
      if (answers.ok) {
        run();
      }
    })
    .catch(logger.fatal);
}

function run() {
  if (isLocalPath(template) === true) {
    downloadAndGenerate(template);
    return;
  }

  let templatePath = getTemplatePath(template);
  if (exists(templatePath)) {
    generate(name, templatePath, to, (err) => {
      if (err) {
        logger.fatal(err);
      }
      console.log();
      logger.success('Generated "%s".', name);
    });
  } else {
    logger.fatal('Local template "%s" not found.', template);
  }
}

function downloadAndGenerate(template) {
  const spinner = ora(" Downloading Quasar starter kit");
  spinner.start();

  if (exists(tmp)) {
    rm(tmp);
  }

  download(template, tmp, { clone: argv.clone }, (err) => {
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
      logger.success('Generated "%s".', name);
    });
  });
}
