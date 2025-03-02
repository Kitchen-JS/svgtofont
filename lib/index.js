"use strict";
/// <reference types="./types" />
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const image2uri_1 = __importDefault(require("image2uri"));
const colors_cli_1 = __importDefault(require("colors-cli"));
const generate_1 = require("./generate");
const utils_1 = require("./utils");
let pkg = {};
exports.default = async (options = {}) => {
    const pkgPath = path_1.default.join(process.cwd(), 'package.json');
    if (fs_extra_1.default.pathExistsSync(pkgPath)) {
        pkg = require(pkgPath);
        if (pkg.svgtofont) {
            options = Object.assign(Object.assign({}, options), pkg.svgtofont);
        }
    }
    options.dist = options.dist || path_1.default.join(process.cwd(), 'fonts');
    options.src = options.src || path_1.default.join(process.cwd(), 'svg');
    options.startUnicode = options.startUnicode || 0xea01;
    options.svg2ttf = options.svg2ttf || {};
    options.emptyDist = options.emptyDist;
    options.fontName = options.fontName || 'iconfont';
    options.svgicons2svgfont = options.svgicons2svgfont || {};
    options.svgicons2svgfont.fontName = options.fontName;
    options.classNamePrefix = options.classNamePrefix || options.fontName;
    options.version = pkg.version;
    const fontSize = options.css && typeof options.css !== 'boolean' && options.css.fontSize ? options.css.fontSize : '16px';
    // If you generate a font you need to generate a style.
    if (!options.css)
        options.css = true;
    try {
        if (options.emptyDist) {
            await fs_extra_1.default.emptyDir(options.dist);
        }
        // Ensures that the directory exists.
        await fs_extra_1.default.ensureDir(options.dist);
        const unicodeObject = await (0, utils_1.createSVG)(options);
        let jsString = [];
        let cssString = [];
        let cssToVars = [];
        let cssIconHtml = [];
        let unicodeHtml = [];
        let symbolHtml = [];
        const prefix = options.classNamePrefix || options.fontName;
        Object.keys(unicodeObject).forEach(name => {
            const _code = unicodeObject[name];
            let symbolName = options.classNamePrefix + '-' + name;
            let iconPart = symbolName + '">';
            let encodedCodes = _code.charCodeAt(0);
            if (options.useNameAsUnicode) {
                symbolName = name;
                iconPart = prefix + '">' + name;
                encodedCodes = _code.split('').map(x => x.charCodeAt(0)).join(';&amp;#');
            }
            else {
                cssString.push(`.${symbolName}:before { content: "\\${encodedCodes.toString(16)}"; }\n`);
                cssToVars.push(`$${symbolName}: "\\${encodedCodes.toString(16)}";\n`);
            }
            //console.log(encodedCodes, encodedCodes.toString(16))
            jsString.push(`"${symbolName}": {"unicode": "${encodedCodes.toString(16)}", "htmlcode": "#${encodedCodes};", "char": "${String.fromCodePoint(parseInt(encodedCodes.toString(16), 16))}"  } `);
        });
        const ttf = await (0, utils_1.createTTF)(options);
        await (0, utils_1.createEOT)(options, ttf);
        await (0, utils_1.createWOFF)(options, ttf);
        await (0, utils_1.createWOFF2)(options, ttf);
        await (0, utils_1.createSvgSymbol)(options);
        /** ${options.fontName} v${pkg.version}
    * ${options.website.links[0].url} */
        if (options.css) {
            const styleTemplatePath = options.styleTemplates || (!options.useNameAsUnicode ? path_1.default.resolve(__dirname, 'styles') : path_1.default.resolve(__dirname, 'ligature-styles'));
            await (0, utils_1.copyTemplate)(styleTemplatePath, options.dist, {
                fontname: options.fontName,
                version: pkg.version,
                url: options.website.links[0].url,
                cssString: cssString.join(''),
                cssToVars: cssToVars.join(''),
                fontSize: fontSize,
                timestamp: new Date().getTime(),
                prefix,
                _opts: typeof options.css === 'boolean' ? {} : Object.assign({}, options.css)
            });
        }
        if (options.typescript) {
            await (0, utils_1.createTypescript)(Object.assign(Object.assign({}, options), { typescript: options.typescript }));
        }
        if (options.website) {
            const pageName = ['font-class', 'unicode', 'symbol'];
            let fontClassPath = path_1.default.join(options.dist, 'index.html');
            let unicodePath = path_1.default.join(options.dist, 'unicode.html');
            let symbolPath = path_1.default.join(options.dist, 'symbol.html');
            let jsFileName = options.fontName + '.js';
            let jsPath = path_1.default.join(options.dist, jsFileName);
            // setting default home page.
            const indexName = pageName.includes(options.website.index) ? pageName.indexOf(options.website.index) : 0;
            pageName.forEach((name, index) => {
                const _path = path_1.default.join(options.dist, indexName === index ? 'index.html' : `${name}.html`);
                if (name === 'font-class')
                    fontClassPath = _path;
                if (name === 'unicode')
                    unicodePath = _path;
                if (name === 'symbol')
                    symbolPath = _path;
            });
            // default template
            options.website.template = options.website.template || path_1.default.join(__dirname, 'website', 'index.ejs');
            // template data
            const tempData = Object.assign(Object.assign({ meta: null, links: null, corners: null, description: null, footerInfo: null }, options.website), { fontname: options.fontName, classNamePrefix: options.classNamePrefix, _type: 'font-class', _link: `${(options.css && typeof options.css !== 'boolean' && options.css.fileName) || options.fontName}.css`, _IconHtml: cssIconHtml.join(''), _title: options.website.title || options.fontName });
            // website logo
            if (options.website.logo && fs_extra_1.default.pathExistsSync(options.website.logo) && path_1.default.extname(options.website.logo) === '.svg') {
                tempData.logo = fs_extra_1.default.readFileSync(options.website.logo).toString();
            }
            // website favicon
            if (options.website.favicon && fs_extra_1.default.pathExistsSync(options.website.favicon)) {
                tempData.favicon = (0, image2uri_1.default)(options.website.favicon);
            }
            else {
                tempData.favicon = '';
            }
            const classHtmlStr = await (0, utils_1.createHTML)(options.website.template, tempData);
            fs_extra_1.default.outputFileSync(fontClassPath, classHtmlStr);
            console.log(`${colors_cli_1.default.green('SUCCESS')} Created ${fontClassPath} `);
            tempData._IconHtml = unicodeHtml.join('');
            tempData._type = 'unicode';
            const unicodeHtmlStr = await (0, utils_1.createHTML)(options.website.template, tempData);
            fs_extra_1.default.outputFileSync(unicodePath, unicodeHtmlStr);
            console.log(`${colors_cli_1.default.green('SUCCESS')} Created ${unicodePath} `);
            tempData._IconHtml = symbolHtml.join('');
            tempData._type = 'symbol';
            const symbolHtmlStr = await (0, utils_1.createHTML)(options.website.template, tempData);
            fs_extra_1.default.outputFileSync(symbolPath, symbolHtmlStr);
            console.log(`${colors_cli_1.default.green('SUCCESS')} Created ${unicodePath} `);
            /**************************************************************************************/
            //Output JS
            let tempJS = `/**
* ${options.fontName} v${pkg.version}
* @lastBuild ${new Date()}
* @link ${options.website.links[0].url}
*/

const ${options.fontName} = {${jsString.join(',')}};

${options.fontName}['getUnicodeHtmlCode'] = (iconName) =>
{
  return ${options.fontName}[iconName];
}
${options.fontName}['getUnicodeChar'] = (iconName) =>
{
  return String.fromCodePoint(parseInt(${options.fontName}[iconName], 16));
}`;
            fs_extra_1.default.outputFileSync(jsPath, tempJS);
            console.log(`${colors_cli_1.default.green('SUCCESS')} Created ${jsPath} `);
            /**************************************************************************************/
        }
        //Output JS
        let jsFileName = options.fontName + '.js';
        let jsPath = path_1.default.join(options.dist, jsFileName);
        let tempJS = `/**
* ${options.fontName} v${pkg.version}
* @lastBuild ${new Date()}
* ${options.website.links[0].url}
*/

const ${options.fontName} = {${jsString.join(',')}};
${options.fontName}['getChar'] = (iconName) =>
{
  return ${options.fontName}[iconName];
}`;
        fs_extra_1.default.outputFileSync(jsPath, tempJS);
        console.log(`${colors_cli_1.default.green('SUCCESS')} Created ${jsPath} `);
        if (options.outSVGPath) {
            const outPath = await (0, generate_1.generateIconsSource)(options);
            console.log(`${colors_cli_1.default.green('SUCCESS')} Created ${outPath} `);
        }
        if (options.outSVGReact) {
            const outPath = await (0, generate_1.generateReactIcons)(options);
            console.log(`${colors_cli_1.default.green('SUCCESS')} Created React Components. `);
        }
    }
    catch (error) {
        console.log('SvgToFont:CLI:ERR:', error);
    }
};
/**
 * https://github.com/Microsoft/TypeScript/issues/5565#issuecomment-155226290
 */
module.exports = exports["default"];
//# sourceMappingURL=index.js.map