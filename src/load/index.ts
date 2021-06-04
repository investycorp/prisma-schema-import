import { writeFile } from 'fs';
import path from 'path';
import semver from 'semver';

import { getRecentVersion } from '../checkUpdates';
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

  return schemaDependencies.length
    ? {
      name: schemaDependencies[0],
      version:
        packageJson.dependencies[schemaDependencies[0]]
          ? packageJson.dependencies[schemaDependencies[0]].replace('^', '')
          : packageJson.devDependencies[schemaDependencies[0]].replace('^', ''),
    }
    : null;
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
    outputMessage('cyan', `schema is saved at ${schemaPath}`);
  });
};

const loadSchema = () => {
  const schemaDependency = getSchemaDependency();

  if (schemaDependency) {
    const localVersion = schemaDependency.version;
    const registryVersion = getRecentVersion(getAppPath, schemaDependency.name);

    outputMessage('green', `${schemaDependency.name}@${schemaDependency.version} is detected!`);

    if (semver.lt(localVersion, registryVersion)) {
      outputMessage('orange', `Schema updates available!\n${schemaDependency.version} -> ${registryVersion}`);
    }

    writeSchema(schemaDependency.name);
  } else {
    outputMessage('red', 'Prisma schema dependencies are not detected');
  }
};

export default loadSchema;
