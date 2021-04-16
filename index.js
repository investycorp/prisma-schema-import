#!/usr/bin/env node

const { program } = require('commander');

console.log(Object.keys(require(__dirname + '/package.json').dependencies));