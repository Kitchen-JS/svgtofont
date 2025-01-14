#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const yargs_1 = __importDefault(require("yargs"));
const path_1 = __importDefault(require("path"));
const _1 = __importDefault(require("./"));
const argv = yargs_1.default
    .alias('s', 'sources')
    .describe('s', 'The root from which all sources are relative.')
    .alias('o', 'output')
    .describe('o', 'Output directory.')
    .alias('f', 'fontName')
    .describe('f', 'Font Name.')
    .demandOption(['output', 'sources'])
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2023')
    .argv;
const sourcesPath = path_1.default.join(process.cwd(), argv.sources);
const outputPath = path_1.default.join(process.cwd(), argv.output);
if (!fs_extra_1.default.pathExistsSync(sourcesPath)) {
    console.error('The directory does not exist!', sourcesPath);
    process.exit();
}
if (!fs_extra_1.default.pathExistsSync(outputPath)) {
    fs_extra_1.default.mkdirpSync(outputPath);
}
(0, _1.default)({
    src: sourcesPath,
    dist: outputPath,
    // emptyDist: true, // Clear output directory contents
    fontName: (argv.fontName) || "svgfont",
    //css: true, // Create CSS files.
    css: {
        fontSize: "6rem",
    },
    outSVGReact: true,
    outSVGPath: true,
    svgicons2svgfont: {
        fontHeight: 1000,
        normalize: true,
    },
})
    .then(() => {
    console.log('done!');
}).catch((err) => {
    console.log('SvgToFont:ERR:', err);
});
//# sourceMappingURL=cli.js.map