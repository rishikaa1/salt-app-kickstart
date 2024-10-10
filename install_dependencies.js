import {exec} from 'child_process';
import chalk from 'chalk';
import util from 'util';
import exec_childprocess from './exec_childprocess.js';
import fs from 'fs-extra'; // import fs-extra for directory checks

const execPromise = util.promisify(exec);

const dependencies=[
    {
      name:'react',
      version:'18.3.1'
    },
    {
      name:'react-dom',
      version:'18.3.1'
    },
    {
      name:'react-scripts',
      version:'5.0.1'
    },
    {
        name:'@salt-ds/core',
        version:'1.32.0'
    },
    {
        name:'@salt-ds/lab',
        version:'1.0.0-alpha.50'
    },
    {
        name:'@salt-ds/ag-grid-theme',
        version:'1.4.3'
    },
    {
        name:'ag-grid-react',
        version:'32.0.2'
    },
    {
        name:'ag-grid-enterprise',
        version:'32.0.2'
    },
    {
        name:'@salt-ds/theme',
        version:'1.20.0'
    },
    {
        name:'@salt-ds/icons',
        version:'1.12.1'
    }
];

const install_dependencies=async (projectName, customDir) => {
    console.log(chalk.green("Installing Dependencies..."));

    // check if the custom directory exists
    if (!fs.existsSync(customDir)) {
        const createDir = await promptUser(`The directory ${customDir} does not exist. Would you like to create it? (yes/no)`);
        if (createDir.toLowerCase() === 'yes') {
            fs.mkdirSync(customDir, { recursive: true }); // Create the directory
            console.log(chalk.green(`Directory ${customDir} created.`));
        } else {
            console.log(chalk.red('Installation aborted.'));
            return; // Exit if user does not want to create the directory
        }
    }
    
    // create the install command string
    const install_command=`npm install ${dependencies.map(dep => {
        const {name,version}=dep;
        console.log(`${name}@${version}\n`);
        return `${name}@${version}`;
    }).join(' ')}`;
    
    // commands to execute 
    const commands=[
        `mkdir ${customDir}/${projectName} && cd ${customDir}/${projectName}`,
        'npx create-react-app ./',
        install_command 
        // `npm install react`
        ];

    const fullCommand = commands.join(' && ');
    console.log(fullCommand);

    try{
        await exec_childprocess(fullCommand,{ shell: true });
        console.log(chalk.green('Dependencies installed Successfully.'));
    }catch(err){
    console.log("Error: "+err.message);
}
};

// Function to prompt user for input
const promptUser = async (question) => {
    return new Promise((resolve) => {
        process.stdout.write(`${question} `);
        process.stdin.on('data', (data) => {
            resolve(data.toString().trim());
        });
    });
};

export default install_dependencies;
