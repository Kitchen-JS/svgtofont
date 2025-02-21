"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHTML = exports.copyTemplate = exports.createSvgSymbol = exports.createWOFF2 = exports.createWOFF = exports.createEOT = exports.createTTF = exports.createTypescript = exports.snakeToUppercase = exports.filterSvgFiles = exports.createSVG = void 0;
const svgicons2svgfont_1 = __importDefault(require("svgicons2svgfont"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const colors_cli_1 = __importDefault(require("colors-cli"));
const cheerio_1 = __importDefault(require("cheerio"));
const svg2ttf_1 = __importDefault(require("svg2ttf"));
const ttf2eot_1 = __importDefault(require("ttf2eot"));
const ttf2woff_1 = __importDefault(require("ttf2woff"));
const ttf2woff2_1 = __importDefault(require("ttf2woff2"));
const copy_template_dir_1 = __importDefault(require("copy-template-dir"));
const del_1 = __importDefault(require("del"));
const move_file_1 = __importDefault(require("move-file"));
let UnicodeObj = {};
/**
 * Unicode Private Use Area start.
 * https://en.wikipedia.org/wiki/Private_Use_Areas
 */
let startUnicode = 0xea01;
/**
 * SVG to SVG font
 */
function createSVG(options = {}) {
    startUnicode = options.startUnicode;
    UnicodeObj = {};
    return new Promise((resolve, reject) => {
        // init
        const fontStream = new svgicons2svgfont_1.default(Object.assign({}, options.svgicons2svgfont));
        function writeFontStream(svgPath) {
            // file name
            let _name = path_1.default.basename(svgPath, ".svg");
            const glyph = fs_extra_1.default.createReadStream(svgPath);
            glyph.metadata = { unicode: getIconUnicode(_name, options.useNameAsUnicode), name: _name };
            fontStream.write(glyph);
        }
        const DIST_PATH = path_1.default.join(options.dist, options.fontName + ".svg");
        // Setting the font destination
        fontStream.pipe(fs_extra_1.default.createWriteStream(DIST_PATH))
            .on("finish", () => {
            console.log(`${colors_cli_1.default.green('SUCCESS')} ${colors_cli_1.default.blue('SVG')} font successfully created!\n  ╰┈▶ ${DIST_PATH}`);
            resolve(UnicodeObj);
        })
            .on("error", (err) => {
            if (err) {
                reject(err);
            }
        });
        filterSvgFiles(options.src).forEach((svg) => {
            if (typeof svg !== 'string')
                return false;
            writeFontStream(svg);
        });
        // Do not forget to end the stream
        fontStream.end();
    });
}
exports.createSVG = createSVG;
/*
 * Filter svg files
 * @return {Array} svg files
 */
function filterSvgFiles(svgFolderPath) {
    let files = fs_extra_1.default.readdirSync(svgFolderPath, 'utf-8');
    let svgArr = [];
    if (!files) {
        throw new Error(`Error! Svg folder is empty.${svgFolderPath}`);
    }
    for (let i in files) {
        if (typeof files[i] !== 'string' || path_1.default.extname(files[i]) !== '.svg')
            continue;
        if (!~svgArr.indexOf(files[i])) {
            svgArr.push(path_1.default.join(svgFolderPath, files[i]));
        }
    }
    return svgArr;
}
exports.filterSvgFiles = filterSvgFiles;
function snakeToUppercase(str) {
    return str.split(/[-_]/)
        .map(partial => partial.charAt(0).toUpperCase() + partial.slice(1))
        .join('');
}
exports.snakeToUppercase = snakeToUppercase;
/**
 * Create typescript declarations for icon classnames
 */
async function createTypescript(options) {
    const tsOptions = options.typescript === true ? {} : options.typescript;
    const uppercaseFontName = snakeToUppercase(options.fontName);
    const { extension = 'd.ts', enumName = uppercaseFontName } = tsOptions;
    const DIST_PATH = path_1.default.join(options.dist, `${options.fontName}.${extension}`);
    const fileNames = filterSvgFiles(options.src).map(svgPath => path_1.default.basename(svgPath, path_1.default.extname(svgPath)));
    await fs_extra_1.default.writeFile(DIST_PATH, `export enum ${enumName} {\n` +
        fileNames.map(name => `  ${snakeToUppercase(name)} = "${options.classNamePrefix}-${name}"`).join(',\n') +
        '\n}\n\n' +
        `export type ${enumName}Classname = ${fileNames.map(name => `"${options.classNamePrefix}-${name}"`).join(' | ')}\n` +
        `export type ${enumName}Icon = ${fileNames.map(name => `"${name}"`).join(' | ')}\n` +
        `export const ${enumName}Prefix = "${options.classNamePrefix}-"`);
    console.log(`${colors_cli_1.default.green('SUCCESS')} Created ${DIST_PATH}`);
}
exports.createTypescript = createTypescript;
/*
 * Get icon unicode
 * @return {Array} unicode array
 */
function getIconUnicode(name, useNameAsUnicode) {
    let unicode = !useNameAsUnicode ? String.fromCharCode(startUnicode++) : name;
    UnicodeObj[name] = unicode;
    return [unicode];
}
/**
 * SVG font to TTF
 */
function createTTF(options = {}) {
    return new Promise((resolve, reject) => {
        options.svg2ttf = options.svg2ttf || {};
        const DIST_PATH = path_1.default.join(options.dist, options.fontName + ".ttf");
        let ttf = (0, svg2ttf_1.default)(fs_extra_1.default.readFileSync(path_1.default.join(options.dist, options.fontName + ".svg"), "utf8"), options.svg2ttf);
        const ttfBuf = Buffer.from(ttf.buffer);
        fs_extra_1.default.writeFile(DIST_PATH, ttfBuf, (err) => {
            if (err) {
                return reject(err);
            }
            console.log(`${colors_cli_1.default.green('SUCCESS')} ${colors_cli_1.default.blue('TTF')} font successfully created!\n  ╰┈▶ ${DIST_PATH}`);
            resolve(ttfBuf);
        });
    });
}
exports.createTTF = createTTF;
;
/**
 * TTF font to EOT
 */
function createEOT(options = {}, ttf) {
    return new Promise((resolve, reject) => {
        const DIST_PATH = path_1.default.join(options.dist, options.fontName + '.eot');
        const eot = Buffer.from((0, ttf2eot_1.default)(ttf).buffer);
        fs_extra_1.default.writeFile(DIST_PATH, eot, (err) => {
            if (err) {
                return reject(err);
            }
            console.log(`${colors_cli_1.default.green('SUCCESS')} ${colors_cli_1.default.blue('EOT')} font successfully created!\n  ╰┈▶ ${DIST_PATH}`);
            resolve(eot);
        });
    });
}
exports.createEOT = createEOT;
;
/**
 * TTF font to WOFF
 */
function createWOFF(options = {}, ttf) {
    return new Promise((resolve, reject) => {
        const DIST_PATH = path_1.default.join(options.dist, options.fontName + ".woff");
        const woff = Buffer.from((0, ttf2woff_1.default)(ttf).buffer);
        fs_extra_1.default.writeFile(DIST_PATH, woff, (err) => {
            if (err) {
                return reject(err);
            }
            console.log(`${colors_cli_1.default.green('SUCCESS')} ${colors_cli_1.default.blue('WOFF')} font successfully created!\n  ╰┈▶ ${DIST_PATH}`);
            resolve(woff);
        });
    });
}
exports.createWOFF = createWOFF;
;
/**
 * TTF font to WOFF2
 */
function createWOFF2(options = {}, ttf) {
    return new Promise((resolve, reject) => {
        const DIST_PATH = path_1.default.join(options.dist, options.fontName + ".woff2");
        const woff2 = Buffer.from((0, ttf2woff2_1.default)(ttf).buffer);
        fs_extra_1.default.writeFile(DIST_PATH, woff2, (err) => {
            if (err) {
                return reject(err);
            }
            console.log(`${colors_cli_1.default.green('SUCCESS')} ${colors_cli_1.default.blue('WOFF2')} font successfully created!\n  ╰┈▶ ${DIST_PATH}`);
            resolve({
                path: DIST_PATH
            });
        });
    });
}
exports.createWOFF2 = createWOFF2;
;
/**
 * Create SVG Symbol
 */
function createSvgSymbol(options = {}) {
    const DIST_PATH = path_1.default.join(options.dist, `${options.fontName}.symbol.svg`);
    const $ = cheerio_1.default.load('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="display:none;"></svg>');
    return new Promise((resolve, reject) => {
        filterSvgFiles(options.src).forEach(svgPath => {
            const fileName = path_1.default.basename(svgPath, path_1.default.extname(svgPath));
            const file = fs_extra_1.default.readFileSync(svgPath, "utf8");
            const svgNode = $(file);
            const symbolNode = $("<symbol></symbol>");
            symbolNode.attr("viewBox", svgNode.attr("viewBox"));
            symbolNode.attr("id", `${options.classNamePrefix}-${fileName}`);
            symbolNode.append(svgNode.html());
            $('svg').append(symbolNode);
        });
        fs_extra_1.default.writeFile(DIST_PATH, $.html("svg"), (err) => {
            if (err) {
                return reject(err);
            }
            console.log(`${colors_cli_1.default.green('SUCCESS')} ${colors_cli_1.default.blue('Svg Symbol')} font successfully created!\n  ╰┈▶ ${DIST_PATH}`);
            resolve({
                path: DIST_PATH,
                svg: $.html("svg")
            });
        });
    });
}
exports.createSvgSymbol = createSvgSymbol;
;
/**
 * Copy template files
 */
function copyTemplate(inDir, outDir, _a) {
    var { _opts } = _a, vars = __rest(_a, ["_opts"]);
    const removeFiles = [];
    return new Promise((resolve, reject) => {
        //console.log(vars)
        (0, copy_template_dir_1.default)(inDir, outDir, Object.assign(Object.assign({}, vars), { cssPath: _opts.cssPath || '', filename: _opts.fileName || vars.fontname }), async (err, createdFiles) => {
            if (err)
                reject(err);
            createdFiles = createdFiles.map(filePath => {
                if (_opts.include && (new RegExp(_opts.include)).test(filePath) || !_opts.include) {
                    return filePath;
                }
                else {
                    removeFiles.push(filePath);
                }
            }).filter(Boolean);
            if (removeFiles.length > 0) {
                await (0, del_1.default)([...removeFiles]);
            }
            createdFiles = await Promise.all(createdFiles.map(async (file) => {
                if (!file.endsWith('.template')) {
                    return file;
                }
                const changedFile = file.replace('.template', '');
                await (0, move_file_1.default)(file, changedFile);
                return changedFile;
            }));
            if (_opts.output) {
                const output = path_1.default.join(process.cwd(), _opts.output);
                await Promise.all(createdFiles.map(async (file) => {
                    await (0, move_file_1.default)(file, path_1.default.join(output, path_1.default.basename(file)));
                    return null;
                }));
            }
            createdFiles.forEach(filePath => console.log(`${colors_cli_1.default.green('SUCCESS')} Created ${filePath} `));
            resolve(createdFiles);
        });
    });
}
exports.copyTemplate = copyTemplate;
;
/**
 * Create HTML
 */
function createHTML(outPath, data, options) {
    return new Promise((resolve, reject) => {
        ejs_1.default.renderFile(outPath, data, options, (err, str) => {
            if (err)
                reject(err);
            resolve(str);
        });
    });
}
exports.createHTML = createHTML;
;
/**
 * Create JS
 * export function createSvgSymbol(options: SvgToFontOptions = {}) {
 */
//  export function createJS(options: SvgToFontOptions = {}) {
//   const DIST_PATH = path.join(options.dist, `${options.fontName}.js`);
//   const $ = cheerio.load('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="display:none;"></svg>');
//   return new Promise((resolve, reject) => {
//     filterSvgFiles(options.src).forEach(svgPath => {
//       const fileName = path.basename(svgPath, path.extname(svgPath));
//       const file = fs.readFileSync(svgPath, "utf8");
//       const svgNode = $(file);
//       const symbolNode = $("<symbol></symbol>");
//       symbolNode.attr("viewBox", svgNode.attr("viewBox"));
//       symbolNode.attr("id", `${options.classNamePrefix}-${fileName}`);
//       symbolNode.append(svgNode.html());
//       $('svg').append(symbolNode);
//     });
//     fs.writeFile(DIST_PATH, $.html("svg"), (err) => {
//       if (err) {
//         return reject(err);
//       }
//       console.log(`${color.green('SUCCESS')} ${color.blue('Svg Symbol')} font successfully created!\n  ╰┈▶ ${DIST_PATH}`);
//       resolve({
//         path: DIST_PATH,
//         svg: $.html("svg")
//       });
//     });
//   });
// };
//# sourceMappingURL=utils.js.map