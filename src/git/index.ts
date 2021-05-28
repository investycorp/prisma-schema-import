import { execSync, ExecSyncOptions } from 'child_process';

const gitInitialize = (directory: string) => {
  const execOptions: ExecSyncOptions = {
    stdio: 'ignore',
    cwd: directory,
  };

  execSync(`cd ${directory}`, execOptions);
  execSync('git --version', execOptions);
  execSync('git init', execOptions);
  execSync('git checkout -b main', execOptions);
  execSync('git add -A', execOptions);
  execSync('git commit -m "Initial commit from prisma-schema-import"', execOptions);
};

export default gitInitialize;
