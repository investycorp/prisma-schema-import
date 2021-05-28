import {
  mkdir, writeFile, readFileSync, readdir, copyFileSync,
} from 'fs';
import path from 'path';

import gitInitialize from '../git';
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
  const packageName = `prisma-schema-${name}`;
  const schemaPath = options.schema ? path.resolve(options.schema) : path.resolve(path.join(getAppPath, '/prisma/schema.prisma'));
  const packagePath = options.package ? path.resolve(options.package) : path.resolve(path.join(getAppPath, `../${packageName}`));
  const originalSchema = readFileSync(schemaPath, 'utf-8');
  const schema = `// Generate by prisma-schema-import\n\n${originalSchema}`;

  mkdir(packagePath, () => {
    const schemaScript = readFileSync(`${__dirname}/../schemaScripts/script.js`, 'utf-8');
    const scriptPath = path.resolve(path.join(packagePath, 'index.js'));
    const packageSchemaPath = path.resolve(path.join(packagePath, 'schema.prisma'));
    const packageJsonPath = path.resolve(path.join(packagePath, 'package.json'));
    const packageJsonData = generatePackageJson(packageName);

    writeFile(packageJsonPath, packageJsonData, 'utf-8', () => {
      writeFile(packageSchemaPath, schema, 'utf-8', () => {
        writeFile(scriptPath, schemaScript, 'utf-8', () => {
          readdir(path.dirname(schemaPath), (err, filelist) => {
            filelist.forEach((filename) => {
              copyFileSync(
                path.join(path.dirname(schemaPath), filename), path.join(packagePath, filename),
              );
            });

            gitInitialize(packagePath.toString());
            outputMessage('green', `${packageName} package is generated!`);
            outputMessage('cyan', `package is saved at ${packagePath}`);
          });
        });
      });
    });
  });
};

export default generatePackage;
