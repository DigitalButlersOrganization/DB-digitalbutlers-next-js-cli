import { pascalCase } from './utils/pascalCase.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import chalk from 'chalk';

export class Component {
  constructor({ name, templatePath }) {
    this.templatePath = templatePath;
    this.template = undefined; 

    this.filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.filename);

    this.outputFolder = undefined;
    
    this.name = {
      lowerCase: name.toLowerCase(),
      pascalCase: pascalCase(name)
    }
  }

  replaceVars = (data) => {
    return data.replace(/{{lowerCase}}/g, this.name.lowerCase).replace(/{{pascalCase}}/g, this.name.pascalCase)
  }

  showError = (messages) => {
    messages.forEach(message => {
      console.error(chalk.bgRed.white(message))
    })
  }

  showSuccess = (messages) => {
    messages.forEach(message => {
      console.error(chalk.bgGreen.white(message))
    })
  }
    
  create() {
      this.template = yaml.load(fs.readFileSync(path.join(this.__dirname,this.templatePath), 'utf-8'))
      this.outputFolder = path.join(process.cwd(), this.template.output);
    this.template.instructions.forEach((instruction) => {
      if (fs.existsSync(path.join(this.outputFolder,this.replaceVars(instruction.path)))) {
          this.showError([`File/Folder ${this.replaceVars(instruction.path)} already exists`, `Файл/Папка ${this.replaceVars(instruction.path)} уже существует`]);
        process.exit(1);  
      }
        if (instruction.type === 'folder') {
        fs.mkdirSync(path.join(this.outputFolder, this.replaceVars(instruction.path)), { recursive: true });
      }
      if (instruction.type === 'file') {
        fs.writeFileSync(path.join(this.outputFolder, this.replaceVars(instruction.path)), this.replaceVars(instruction.content));
      }
    })
    this.showSuccess([`Component ${this.name.pascalCase} created`, `Компонент ${this.name.pascalCase} создан`]);
  }
}
