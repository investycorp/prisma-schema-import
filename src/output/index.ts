import chalk from 'chalk';

const outputMessage = (color: string, message: string) => {
  console.log(chalk.keyword(color)(message));
};

export default outputMessage;
