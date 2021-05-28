import { program } from 'commander';

import loadSchema from './load';
import generatePackage from './generate';

const packageJson = require(`${__dirname}/package.json`);

program.version(packageJson.version);

// Load schema
program
  .command('load')
  .description('Load prisma schema from prisma-schema-* package')
  .action(loadSchema);

// Generate schema package
program
  .command('generate <name>')
  .description('Generate prisma-schema-* package from prisma schema')
  .option('-s --schema <schemaPath>', 'path for exist prisma schema', '')
  .option('-p --package <packagePath>', 'path for generated package', '')
  .action(generatePackage);

program.parse(process.argv);
