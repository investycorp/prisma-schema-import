import { writeFile } from 'fs';
import path from 'path';

import outputMessage from '../output';
import getAppPath from '../utils/getAppPath';

const getSchemaDependency = () => {
  const packageJsonPath = path.join(getAppPath, 'package.json');
  const packageJson = require(packageJsonPath);
  const devDependencies = packageJson.devDependencies
    ? Object.keys(packageJson.devDependencies)
    : [];
  const dependencies = packageJson.dependencies ? Object.keys(packageJson.dependencies) : [];
  const schemaDependencies = dependencies.concat(devDependencies)
    .filter(
      (dependency) => !dependency.includes('prisma-schema-import') && dependency.includes('prisma-schema'),
    );

  return schemaDependencies.length ? schemaDependencies[0] : null;
};

const writeSchema = (schemaName: string) => {
  const schema = require(schemaName);
  const schemaPath = path.join(getAppPath, '/prisma/schema.prisma');
  const schemaData = schema();

  writeFile(schemaPath, schemaData, 'utf-8', (err) => {
    if (err) {
      outputMessage('red', err.message);
      return;
    }

    outputMessage('green', `${schemaName} is loaded!`);
    outputMessage('blue', `schema is saved at ${schemaPath}`);
  });
};

const loadSchema = () => {
  const schemaDependency = getSchemaDependency();

  if (schemaDependency) {
    outputMessage('green', `${schemaDependency} is detected!`);
    writeSchema(schemaDependency);
  } else {
    outputMessage('red', 'Prisma schema dependencies are not detected');
  }
};

export default loadSchema;
