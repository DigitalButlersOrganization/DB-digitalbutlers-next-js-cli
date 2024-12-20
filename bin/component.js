import { pascalCase } from "./utils/pascalCase.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import chalk from "chalk";

export class Component {
	constructor({ name, templatePath }) {
		this.templatePath = templatePath;
		this.template = undefined;

		this.filename = fileURLToPath(import.meta.url);
		this.__dirname = path.dirname(this.filename);

		this.outputFolder = undefined;

		this.name = {
			lowerCase: name.toLowerCase(),
			pascalCase: pascalCase(name),
			kebabCase: name,
		};
	}

	replaceVars = (data) => {
		return data
			.replace(/{{lowerCase}}/g, this.name.lowerCase)
			.replace(/{{pascalCase}}/g, this.name.pascalCase);
	};

	showError = (messages) => {
		messages.forEach((message) => {
			console.error(chalk.bgRed.white(message));
		});
	};

	showSuccess = (messages) => {
		messages.forEach((message) => {
			console.error(chalk.bgGreen.white(message));
		});
	};

	create() {
		this.followInstructions();

		this.changeExportFile();

		this.showSuccess([
			`Component ${this.name.pascalCase} created`,
			`Компонент ${this.name.pascalCase} создан`,
		]);
	}

	followInstructions = () => {
		this.template = yaml.load(
			fs.readFileSync(path.join(this.__dirname, this.templatePath), "utf-8"),
		);

		this.outputFolder = path.join(process.cwd(), this.template.output);

		if (!fs.existsSync(this.outputFolder)) {
			fs.mkdirSync(this.outputFolder);
			// this.showError([`Folder ${this.outputFolder} does not exist`, `Папка ${this.outputFolder} не существует`]);
			// process.exit(1);
		}

		this.template.instructions.forEach((instruction) => {
			if (
				fs.existsSync(
					path.join(this.outputFolder, this.replaceVars(instruction.path)),
				)
			) {
				this.showError([
					`File/Folder ${this.replaceVars(instruction.path)} already exists`,
					`Файл/Папка ${this.replaceVars(instruction.path)} уже существует`,
				]);
				process.exit(1);
			}

			if (instruction.type === "folder") {
				fs.mkdirSync(
					path.join(this.outputFolder, this.replaceVars(instruction.path)),
					{ recursive: true },
				);
			}

			if (instruction.type === "file") {
				const contentPath = instruction.content;
				const content = fs.readFileSync(
					path.join(this.__dirname, contentPath),
					"utf-8",
				);

				fs.writeFileSync(
					path.join(this.outputFolder, this.replaceVars(instruction.path)),
					this.replaceVars(content),
				);
			}
		});
	};

	changeExportFile = () => {
		if (!fs.existsSync(path.join(this.outputFolder, "index.ts"))) {
			fs.writeFileSync(path.join(this.outputFolder, "index.ts"), "");
		}

		const newExportText = fs.readFileSync(
			path.join(this.__dirname, this.template.export.content),
			"utf-8",
		);

		const exportFileContent = fs.readFileSync(
			path.join(this.outputFolder, "index.ts"),
			"utf-8",
		);

		fs.writeFileSync(
			path.join(this.outputFolder, "index.ts"),

			`${this.replaceVars(newExportText)}\n${exportFileContent}`,
		);
	};
}
