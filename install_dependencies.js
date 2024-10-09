import {exec} from 'child_process'
import chalk from 'chalk'
import util from 'util'
import exec_childprocess from './exec_childprocess.js';
import path from 'path';
import fs from 'fs-extra';

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

const install_dependencies = async (projectName, customDirectory = './') => {
    console.log(chalk.green("Installing Dependencies..."));
    
    const install_command=`npm install ${dependencies.map(dep => {
        const {name, version} = dep;
        console.log(`${name}@${version}\n`);
        return `${name}@${version}`
    }).join(' ')}`;

    const fullPath = path.join(customDirectory, projectName);

    await fs.ensureDir(fullPath);
    
    const commands=[
        `cd "${fullPath}"`,
        'npx create-react-app ./',
        install_command
        // `npm install react`
    ];
    
    const fullCommand = commands.join(' && ');
    console.log(fullCommand);
    
    try {
        await exec_childprocess(fullCommand, { shell: true });
        console.log(chalk.green('Dependencies installed successfully.'));

        const packageJsonPath = path.join(fullPath, 'package.json');
        const packageJson = await fs.readJson(packageJsonPath);
        packageJson.name = projectName;
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        console.log(chalk.green('Updated package.json with custom project name.'));
    } catch(err) {
        console.log(chalk.red("Error: "+err.message));
    }
};
export default install_dependencies;
