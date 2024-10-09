import {exec} from 'child_process'
import chalk from 'chalk'
import util from 'util'
import simpleGit from 'simple-git'
import path from 'path'
import exec_childprocess from './exec_childprocess.js'
import inquirer from 'inquirer'

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

const getGitHubCredentials = async () => {
  consr questions = [
    {
      type: 'input',
      name: 'username',
      message: 'Enter your GitHub username:',
      validate: input => input.trim() !== '' || 'Username cannot be empty'
    },
    {
      type: 'password',
      name: 'token',
      message: 'Enter your GitHub Personal Access Token:',
      mask: '*',
      validate: input => input.trim() !== '' || 'Token cannot be empty'
    },
    {
      type: 'input',
      name: 'repositoryName',
      message: 'Enter the repository name:',
      validate: input => input.trim() !== '' || 'Repository name cannot be empty'
    },
    {
      type: 'list',
      name: 'branch',
      message: 'Select the branch name:',
      choices: ['master', 'main', 'develop', new inquirer.Separator(), 'Custom'],
      default: 'main'
    },
    {
      type: 'input',
      name: 'customBranch',
      message: 'Enter the custom branch name:',
      when: answers => answers.branch === 'Custom',
      validate: input => input.trim() !== '' || 'Branch name cannot be empty'
    },
     {
      type: 'input',
      name: 'commitMessage',
      message: 'Enter the commit message:',
      default: 'Initial commit'
    }
  ];

  return inquirer.prompt(questions);
};

const push_to_github=async (projectName, token, username, repositoryName, branch, commitMessage, isAutoPush = false) => {
  console.log(chalk.green("Pushing to github.."));

  let gitConfig;
  if (isAutoPush) {
    gitConfig = { token, username, repositoryName, branch, commitMessage };
  } else {
    gitConfig = await getGitHubCredentials();
    if (gitConfig.branch == 'Custom') {
      gitConfig.branch = gitConfig.customBranch;
    }
  }
  
  const remote=`https://${gitConfig.token}@github.com/${gitConfig.username}/${gitConfig.repositoryName}.git`;
  const commands=[
    `cd ${projectName}`,
    `gh repo create ${gitConfig.repositoryName} --public --description ${gitConfig.repositoryName}`,
    'git init',
    'git add .',
    `git commit -m "${gitConfig.commitMessage}"`,
    `git remote add origin ${remote}`,
    `git push origin ${branch}`
  ];
  
  let directory = path.join(process.cwd(), projectName);
  const fullCommand = commands.join(' && ');
  
  try {
    await checkAndInitializeGitRepo(directory);
    await exec_childprocess(fullCommand,{ shell: true });
    console.log(chalk.green('Pushed to remote repository successfully.'));    
  } catch(err) {
    console.log(chalk.red("Error: "+err.message));
  }
};

export default push_to_github;



