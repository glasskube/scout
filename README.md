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
@glasskube/scout/0.0.0 linux-x64 node-v20.11.1
$ scout --help [COMMAND]
USAGE
  $ scout COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`scout index`](#scout-index)
* [`scout package PACKAGE`](#scout-package-package)
* [`scout update:index`](#scout-updateindex)
* [`scout update:package PACKAGE`](#scout-updatepackage-package)

## `scout index`

updates packages index

```
USAGE
  $ scout index [--dry-run] [-s <value>]

FLAGS
  -s, --source=<value>  packages context
      --dry-run         do not make any changes

DESCRIPTION
  updates packages index

ALIASES
  $ scout update:index

EXAMPLES
  $ scout index
```

_See code: [src/commands/index/index.ts](https://github.com/glasskube/scout/blob/v0.0.0/src/commands/index/index.ts)_

## `scout package PACKAGE`

describe the command here

```
USAGE
  $ scout package PACKAGE [--dry-run] [-f] [-n <value>] [-s <value>]

ARGUMENTS
  PACKAGE  package to scout

FLAGS
  -f, --force
  -n, --name=<value>    name to print
  -s, --source=<value>  packages context
      --dry-run         do not make any changes

DESCRIPTION
  describe the command here

ALIASES
  $ scout update:package

EXAMPLES
  $ scout package
```

_See code: [src/commands/package/index.ts](https://github.com/glasskube/scout/blob/v0.0.0/src/commands/package/index.ts)_

## `scout update:index`

updates packages index

```
USAGE
  $ scout update:index [--dry-run] [-s <value>]

FLAGS
  -s, --source=<value>  packages context
      --dry-run         do not make any changes

DESCRIPTION
  updates packages index

ALIASES
  $ scout update:index

EXAMPLES
  $ scout update:index
```

## `scout update:package PACKAGE`

describe the command here

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
  describe the command here

ALIASES
  $ scout update:package

EXAMPLES
  $ scout update:package
```
<!-- commandsstop -->
