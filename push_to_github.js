import {exec} from 'child_process';
import chalk from 'chalk';
import util from 'util';
import path from 'path';
import exec_childprocess from './exec_childprocess.js';

const execPromise = util.promisify(exec);

async function checkAndInitializeGitRepo(directory) {
  try {
    // Check if the directory is a Git repository
    await execPromise('git rev-parse --is-inside-work-tree', { cwd: directory });
    console.log('Directory is already a Git repository.');
    } catch (error) {
      if (error.stderr.includes('fatal: not a git repository')) {
        console.log('Directory is not a Git repository. Initializing...');
        try {
          // Initialize Git repository
          await execPromise('git init', { cwd: directory });
          console.log('Git repository initialized successfully.');
        } catch (initError) {
          console.error('Failed to initialize Git repository:', initError.message);
        }
      } else {
        console.error('Error checking Git repository status:', error.message);
      }
    }
  }
const push_to_github=async (projectName,token,username,repositoryName,branch,commitMessage)=>{
    console.log(chalk.green("Pushing to github.."));

    const directory = path.join(process.cwd(), projectName); // ensure we're using the correct project directory
    const remote=`https://${token}@github.com/${username}/${repositoryName}.git`;

    const commands=[
        `cd ${directory}`,
        `gh repo create ${repositoryName} --public --description "${repositoryName}"`,
        'git init',
        'git add .',
        `git commit -m ${commitMessage}`,
        // `git remote get-url origin`,
        `git remote add origin ${remote}`,
        `git push origin ${branch}`
    ];

    const fullCommand = commands.join(' && ');
   
    try{
        await checkAndInitializeGitRepo(directory); // pass the correct directory
        await exec_childprocess(fullCommand,{ shell: true });
        console.log(chalk.green('Successfully pushed to remote repository'));    
    }catch(err){
    console.log("Error: "+err.message);
}
};
export default push_to_github;
