import { exec } from 'child_process';
import chalk from 'chalk';
import util from 'util';

const exec_childprocess = (command, options = {}) => {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, options);

    childProcess.stdout.on('data', (data) => {
      console.log(chalk.white(data.toString())); // logs standard output
    });

    childProcess.stderr.on('data', (data) => {
      console.error(chalk.red(data.toString())); // logs standard error
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(); // successfully executed
      } else {
        reject(new Error(`Process exited with code: ${code} for command: ${command}`)); // error context
      }
    });

    childProcess.on('error', (err) => {
      reject(new Error(`Failed to execute command: ${command}. Error: ${err.message}`)); // error message
    });
  });
}
export default exec_childprocess;
