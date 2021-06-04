import { execSync, ExecSyncOptions } from 'child_process';

const getRecentVersion = (directory: string, name: string) => {
  const execOptions: ExecSyncOptions = {
    cwd: directory,
  };
  const version = execSync(`npm view ${name} version`, execOptions).toString().replace('\n', '');

  return version;
};

export { getRecentVersion };
