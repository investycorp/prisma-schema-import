# prisma-schema-import

[![version](https://img.shields.io/npm/v/prisma-schema-import)](https://npmjs.org/package/prisma-schema-import)
[![license](https://img.shields.io/npm/l/prisma-schema-import)](https://github.com/investycorp/prisma-schema-import/LICENSE)

## Install

```shell script
yarn add -D prisma-schema-import
```

And install your schema package (prisma-schema-*)

## How to use

### Generate your schema package

```shell script
yarn prisma-schema-import generate <prisma-schema-schemaName>
```

prisma-schema-import will generate your schema package on '../prisma-schema-schemaName' directory.

### Publish your schema package

Move to schema package directory, and edit package.json.

The package.json file generated by default does not contain author, repository, license, and publishConfig fields.

Fill in all the fields and deploy the package to an npm repository or private repository via npm or yarn's publish command. 

### Load your schema package on prisma

```shell script
yarn add -D <prisma-schema-schemaName>
yarn prisma-schema-import load
```

Install your schema package and run prisma-schema-import load command.

prisma-schema-import will load your schema on schema package, and overwrite a /prisma/schema.prisma file.

## Commands

```
load  Load prisma schema from prisma-schema-* package
generate [options] <name>  Generate prisma-schema-* package from prisma schema
```

## Options

### generate

```
-s --schema <schemaPath>    path for exist prisma schema (default: "")
-p --package <packagePath>  path for generated package (default: "")
```