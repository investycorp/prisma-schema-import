import { execSync, ExecSyncOptions } from 'child_process';

const isGitRepository = (directory: string) => {
  try {
    const execOptions: ExecSyncOptions = {
      stdio: 'ignore',
      cwd: directory,
    };

    execSync('git rev-parse --is-inside-work-tree', execOptions);
  } catch (_) {
    return false;
  }
};

const gitInitialize = (directory: string) => {
  const execOptions: ExecSyncOptions = {
    stdio: 'ignore',
    cwd: directory,
  };

  execSync('git --version', execOptions);

  if (isGitRepository(directory) === false) {
    execSync('git init', execOptions);
    execSync('git checkout -b main', execOptions);
    execSync('git add -A', execOptions);
    execSync('git commit -m "Initial commit from prisma-schema-import"', execOptions);
  }
};

export default gitInitialize;
