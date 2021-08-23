# OpenJDL CLI
> WIP



## Installation

First, make sure you have Node >= 14 and NPM >= 7.

```bash
# install OpenJDL CLI:
$ npm install -g @openjdl/cli

# or use yarn:
$ yarn global add @openjdl/cli
```



## Generate

> Generate files from template

**Usage**

```shell
$ openjdl generate [--kit <kit-name>] [--branch <version-name>]
# or
$ openjdl gen [--kit <kit-name>] [--branch <version-name>]
```

**Options**

```shell
--kit, -k      Use specific kit
--branch, -b   Use specific branch of the kit, default main
--clone, -c    Use git clone
--offline, -o  Use a cached kit
--token, -t    Gitlab private token
--help, -h     Displays help message
```

**Example**

```bash
# generate with example
$ openjdl generate <folder_name>

# use your github kit
$ openjdl generate <folder_name> --kit my_group/my_project

# use your gitlab kit
$ openjdl generate <folder_name> --kit gitlab:my_gitlab.com:my_group/my_project

# use your gitlab kit with private token
$ openjdl generate <folder_name> --kit gitlab:my_gitlab.com:my_group/my_project --token my_token
```

## License

Copyright (c) 2021-present Teng Da

[MIT License](http://en.wikipedia.org/wiki/MIT_License)