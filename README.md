# Glasskube scout


<!-- toc -->
* [Glasskube scout](#glasskube-scout)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @glasskube/scout
$ scout COMMAND
running command...
$ scout (--version)
@glasskube/scout/0.0.0 linux-x64 node-v21.6.1
$ scout --help [COMMAND]
USAGE
  $ scout COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`scout update:package PACKAGE`](#scout-updatepackage-package)
* [`scout update:packageIndex`](#scout-updatepackageindex)

## `scout update:package PACKAGE`

updates a glasskube package manifest

```
USAGE
  $ scout update:package PACKAGE [--dry-run] [-f] [-n <value>] [-s <value>]

ARGUMENTS
  PACKAGE  package to scout

FLAGS
  -f, --force
  -n, --name=<value>    name to print
  -s, --source=<value>  packages context
      --dry-run         do not make any changes

DESCRIPTION
  updates a glasskube package manifest

EXAMPLES
  $ scout update:package
```

_See code: [src/commands/update/package.ts](https://github.com/glasskube/scout/blob/v0.0.0/src/commands/update/package.ts)_

## `scout update:packageIndex`

updates packages index

```
USAGE
  $ scout update:packageIndex [--dry-run] [-s <value>]

FLAGS
  -s, --source=<value>  packages context
      --dry-run         do not make any changes

DESCRIPTION
  updates packages index

EXAMPLES
  $ scout update:packageIndex
```

_See code: [src/commands/update/packageIndex.ts](https://github.com/glasskube/scout/blob/v0.0.0/src/commands/update/packageIndex.ts)_
<!-- commandsstop -->
