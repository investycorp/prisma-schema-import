#!/usr/bin/env node
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const { program } = require('commander');

const appPath = process.cwd();

// Load prisma schema from prisma-schema-* package
const loadSchema = function () {
    const packageJsonPath = path.join(appPath, 'package.json');
    const packageJson = require(packageJsonPath);
    const localDependencies = packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
    const devDependencies = packageJson.devDependencies ? Object.keys(packageJson.devDependencies) : [];
    const dependencies = localDependencies.concat(devDependencies);
    const schemaDependencies = dependencies.filter(dependency => !dependency.includes('prisma-schema-import') && dependency.includes('prisma-schema-'));

    if (schemaDependencies.length) {
        const schemaName = schemaDependencies[0];
        const schema = require(schemaDependencies[0]);
        const schemaPath = path.join(appPath, '/prisma/schema.prisma');
        const schemaData = schema();
    
        fs.writeFile(schemaPath, schemaData, 'utf-8', function (err) {
            if (!err) {
                console.log(chalk.keyword('green')(`${schemaName} is loaded!`));
                console.log(chalk.keyword('blue')(`schema is saved at ${schemaPath}`));
            }
        });
    } else {
        console.log(chalk.keyword('orange')('Prisma schema dependencies are not detected'));
    }
};

// Generate prisma-schema-* package from prisma schema
const generatePackage = function (name, options) {
    const schemaPath = options.schema !== '' ? options.schema : path.join(appPath, '/prisma/schema.prisma');
    const packagePath = options.package !== '' ? options.package : path.join(appPath, `../${name}`);

    console.log(schemaPath);
    console.log(packagePath);
};

// Commander commands

const libraryInfo = require(`${__dirname}/package.json`);

program.version(libraryInfo.version);

program
    .command('load')
    .description('Load prisma schema from prisma-schema-* package')
    .action(loadSchema);

program
    .command('generate <name>')
    .description('Generate prisma-schema-* package from prisma schema')
    .option('-s --schema <schemaPath>', 'path for exist prisma schema', '')
    .option('-p --package <packagePath>', 'path for generated package', '')
    .action(generatePackage);

program.parse(process.argv);