import {
  mkdir, writeFile, readFileSync,
} from 'fs';
import path from 'path';

import { SCHEMA_SCRIPT } from '../constants';
import outputMessage from '../output';
import { generatePackageOptions } from '../types/generate';
import getAppPath from '../utils/getAppPath';

const generatePackageJson = (name: string) => JSON.stringify({
  name,
  version: '1.0.0',
  description: 'Schema for prisma-schema-import',
  main: 'index.js',
  files: [
    'schema.prisma',
  ],
}, null, 4);

const generatePackage = (name: string, options: generatePackageOptions) => {
  const schemaPath = options.schema ? path.resolve(options.schema) : path.resolve(path.join(getAppPath, '/prisma/schema.prisma'));
  const packagePath = options.package ? path.resolve(options.package) : path.resolve(path.join(getAppPath, `../${name}`));
  const originalSchema = readFileSync(schemaPath, 'utf-8');
  const schema = `// Generate by prisma-schema-import\n\n${originalSchema}`;

  mkdir(packagePath, () => {
    const scriptPath = path.resolve(path.join(packagePath, 'index.js'));
    const packageSchemaPath = path.resolve(path.join(packagePath, 'schema.prisma'));
    const packageJsonPath = path.resolve(path.join(packagePath, 'package.json'));
    const packageJsonData = generatePackageJson(name);

    writeFile(packageJsonPath, packageJsonData, 'utf-8', () => {
      writeFile(packageSchemaPath, schema, 'utf-8', () => {
        writeFile(scriptPath, SCHEMA_SCRIPT, 'utf-8', () => {
          outputMessage('green', `${name} package is generated!`);
          outputMessage('blue', `package is saved at ${packagePath}`);
        });
      });
    });
  });
};

export default generatePackage;
