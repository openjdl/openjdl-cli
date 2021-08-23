console.log("  Running @openjdl/cli v" + require("../package.json").version);

console.log(`
  Example usage
    $ openjdl <command> <options>

  Help for a command
    $ openjdl <command> --help
    $ openjdl <command> -h

  Options
    --version, -v Print OpenJDL CLI version

  Commands
    generate, gen     Generate files from metalsmith templates     
    info, i           Display info about your machine and your App
    help, h           Displays this message

  If the specified command is not found, then "openjdl run"
  will be executed with the provided arguments.
`);
