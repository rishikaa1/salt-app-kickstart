import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyFolder(projectName,template_choices) {
  try {
    const basePath = process.cwd();
    const destinationPath = `${projectName}${path.sep}src`;

    const templates = Array.isArray(template_choices) ? template_choices : [template_choices];

    for (const template of templates) {
      const relativePath = `${path.sep}templates${path.sep}${template.toLowerCase()}`;
      const sourcePath = __dirname;
      const source = sourcePatj + relativePath;
      const destination = path.join(basePath, destinationPath, relativePath);

      await fs.copy(source, destination);
    }

    const files_array = ["index.js", "index.html"];
    for (const filePath of files_array) {
      const fileSource = path.join(__dirname, filePath);
      const fileDestination = path.join(basePath, destinationPath, filePath);
      await fs.copy(fileSource, fileDestination, { overwrite: true });
    }

    let appJsContent = "import React from 'react';\n\n";
    let allJsRemder = "return (\n <div>\n";

    const app_file_content = {
      form: "import Form from './templates/form/Form.js';\n",
      aggrid: "import { Default as AgGrid } from './templates/aggrid/AgGrid.js';\n",
      appheader: "import AppHeader from './templates/appheader/AppHeader.js';\n"
    };

    for (const template of templates) {
      const lowerTemplate = template.toLowerCase();
      if (app_file_content[lowerTemplate]) {
        appJsContent += app_file_content[lowerTemplate];
        appJsRender += `    <${template} />\n`;
      }
    }
    
    appJsContent += "\nfunction App() {\n";
    appJsContent += appJsRender;
    appJsContent += "  </div>\n);\n}\n\nexport default App;\n";

    const appJsPath = path.join(basePath, destinationPath, "App.js");
    await fs.writeFile(appJsPath, appJsContent, 'utf-8');
    console.log(`Content has been successfully written to ${appJsPath}`);

  } catch (err) {
    console.error(`Error copying folder: ${err}`);
  }
}

export default copyFolder;
