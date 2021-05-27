#!/usr/bin/env node
const chalk = require('chalk');
const path = require('path');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = require(packageJsonPath);
const localDependencies = packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
const devDependencies = packageJson.devDependencies ? Object.keys(packageJson.devDependencies) : [];
const dependencies = localDependencies.concat(devDependencies);
const schemaDependencies = dependencies.filter(dependency => !dependency.includes('prisma-schema-import') && dependency.includes('prisma-schema-'));

if (schemaDependencies.length) {
    const schemaName = schemaDependencies[0];
    const schema = require(schemaDependencies[0]);
    
    console.log('schema', schema());
    console.log(chalk.keyword('green')(`${schemaName} is loaded!`));
} else {
    console.log(chalk.keyword('orange')('Prisma schema dependencies are not detected'));
}