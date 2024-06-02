import { Component } from "./component.js";

import fs from 'fs';
import path from 'path';

export class UiComponent extends Component {
  constructor({name, templatePath}) {
    super({ name, templatePath });
  }

  create = () => {
    super.create(); 
    this.changeExportFile();
  }

  changeExportFile = () => {
    const exportFileContent = fs.readFileSync(path.join(this.outputFolder, 'index.ts'), 'utf-8');
    fs.writeFileSync(path.join(this.outputFolder, 'index.ts'), `export { ${this.name.pascalCase} } from './${this.name.lowerCase}';\n${exportFileContent}`);
  }
}
