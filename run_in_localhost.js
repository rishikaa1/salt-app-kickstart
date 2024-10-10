import {exec} from 'child_process'
import chalk from 'chalk'
import util from 'util'
import exec_childprocess from './exec_childprocess.js';
import path from 'path';

const execPromise = util.promisify(exec);

const run_in_localhost = async (projectName, customDirectory = './') => {
    console.log(chalk.green("Launching to Localhost.."));

    const fullPath = path.join(customDirectory, projectName);
    
    const commands=[
        `cd "${fullPath}"`,
        'npm start',
    ];
    
    const fullCommand = commands.join(' && ');
    console.log(chalk.blue('Executing command:'), fullCommand);
    
    try{
        await exec_childprocess(fullCommand,{ shell: true });
        console.log(chalk.green('Running on Localhost'));    
    } catch(err) {
        console.log("Error: "+err.message);
    }
};
export default run_in_localhost;
