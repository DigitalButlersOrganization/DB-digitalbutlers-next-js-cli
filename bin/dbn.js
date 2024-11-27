#!/usr/bin/env node
import { Command } from "commander";
import { Component } from "./component.js";

const program = new Command();

program.command("page <name>").action((name) => {
	const component = new Component({ name, templatePath: "templates/page.yml" });
	component.create();
});

program.command("section <name>").action((name) => {
	const component = new Component({
		name,
		templatePath: "templates/section.yml",
	});
	component.create();
});

program.command("widget <name>").action((name) => {
	const component = new Component({
		name,
		templatePath: "templates/widget.yml",
	});
	component.create();
});

program.command("feature <name>").action((name) => {
	const component = new Component({
		name,
		templatePath: "templates/feature.yml",
	});
	component.create();
});

program.command("ui <name>").action((name) => {
	const component = new Component({ name, templatePath: "templates/ui.yml" });
	component.create();
});

program.parse(process.argv);
