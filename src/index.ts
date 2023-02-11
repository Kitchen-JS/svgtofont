/// <reference types="./types" />

import path from 'path';
import fs from 'fs-extra';
import image2uri from 'image2uri';
import { SVGIcons2SVGFontOptions } from 'svgicons2svgfont';
import color from 'colors-cli';
import { OptimizeOptions } from 'svgo';
import { generateIconsSource, generateReactIcons } from './generate';
import { createSVG, createTTF, createEOT, createWOFF, createWOFF2, createSvgSymbol, copyTemplate, CSSOptions, createTypescript, TypescriptOptions } from './utils';

export type SvgToFontOptions = {
  /**
   * The output directory.
   * @default fonts
   * @example
   * ```
   * path.join(process.cwd(), 'fonts')
   * ```
   */
  dist?: string;
  /**
   * svg path
   * @default svg
   * @example
   * ```
   * path.join(process.cwd(), 'svg')
   * ```
   */
  src?: string;
  /**
   * The font family name you want.
   * @default iconfont
   */
  fontName?: string;
  /**
   * Create CSS/LESS/Scss/Styl files, default `true`.
   */
  css?: boolean | CSSOptions;
  /**
   * Output `./dist/react/`, SVG generates `react` components.
   */
  outSVGReact?: boolean;
  /**
   * Output `./dist/svgtofont.json`, The content is as follows:
   * @example
   * ```js
   * {
   *   "adobe": ["M14.868 3H23v19L14.868 3zM1 3h8.8.447z...."],
   *   "git": ["M2.6 10.59L8.38 4.8l1.69 1.7c-.24c-.6.34-1 .99-1..."],
   *   "stylelint": ["M129.74 243.648c28-100.5.816c2.65..."]
   * }
   * ```
   */
  outSVGPath?: boolean;
  /**
   * This is the setting for [svgicons2svgfont](https://github.com/nfroidure/svgicons2svgfont/tree/dd713bea4f97afa59f7dba6a21ff7f22db565bcf#api)
   */
  svgicons2svgfont?: SVGIcons2SVGFontOptions;
  /** Some options can be configured with svgoOptions though it. [svgo](https://github.com/svg/svgo#configuration) */
  svgoOptions?: OptimizeOptions;
  /**
   * Create font class name prefix, default value font name.
   * @default fontName
   */
  classNamePrefix?: SvgToFontOptions['fontName'];
  /**
  * Directory of custom templates.
  */
  styleTemplates?: string;
  /**
   * unicode start number
   * @default 10000
   */
  startUnicode?: number;
  /**
   * should the name(file name) be used as unicode? this switch allows for the support of ligatures.
   * @default false
   */
  useNameAsUnicode?: boolean;
  /**
   * Clear output directory contents
   * @default false
   */
  emptyDist?: boolean;
  /**
   * This is the setting for [svg2ttf](https://github.com/fontello/svg2ttf/tree/c33a126920f46b030e8ce960cc7a0e38a6946bbc#svg2ttfsvgfontstring-options---buf)
   */
  svg2ttf?: unknown;

  /**
   * Create typescript file with declarations for icon classnames
   * @default false
   */
  typescript?: boolean | TypescriptOptions
}

export default async (options: SvgToFontOptions = {}) => {
  const pkgPath = path.join(process.cwd(), 'package.json');
  if (fs.pathExistsSync(pkgPath)) {
    const pkg = require(pkgPath);
    if (pkg.svgtofont) {
      options = { ...options, ...pkg.svgtofont }
    }
  }

  options.dist = options.dist || path.join(process.cwd(), 'fonts');
  options.src = options.src || path.join(process.cwd(), 'svg');
  options.startUnicode = options.startUnicode || 0xea01;
  options.svg2ttf = options.svg2ttf || {};
  options.emptyDist = options.emptyDist;
  options.fontName = options.fontName || 'iconfont';
  options.svgicons2svgfont = options.svgicons2svgfont || {};
  options.svgicons2svgfont.fontName = options.fontName;
  options.classNamePrefix = options.classNamePrefix || options.fontName;
  const fontSize = options.css && typeof options.css !== 'boolean' && options.css.fontSize ? options.css.fontSize : '16px';
  // If you generate a font you need to generate a style.
  if (!options.css) options.css = true;

  try {
    if (options.emptyDist) {
      await fs.emptyDir(options.dist);
    }
    // Ensures that the directory exists.
    await fs.ensureDir(options.dist);
    const unicodeObject = await createSVG(options);

    let jsString: string[] = [];
    let cssString: string[] = [];
    let cssToVars: string[] = [];
    const prefix = options.classNamePrefix || options.fontName;

    Object.keys(unicodeObject).forEach(name => {
      const _code = unicodeObject[name];
      let symbolName = options.classNamePrefix + '-' + name
      let iconPart = symbolName + '">';
      let encodedCodes: string | number = _code.charCodeAt(0);

      if (options.useNameAsUnicode) {
        symbolName = name;
        iconPart = prefix + '">' + name;
        encodedCodes = _code.split('').map(x => x.charCodeAt(0)).join(';&amp;#');
      } else {
        cssString.push(`.${symbolName}:before { content: "\\${encodedCodes.toString(16)}"; }\n`);
        cssToVars.push(`$${symbolName}: "\\${encodedCodes.toString(16)}";\n`);
      }

      jsString.push(`"${symbolName}": "${encodedCodes.toString(16)}"\n`);
    });

    const ttf = await createTTF(options);
    await createEOT(options, ttf);
    await createWOFF(options, ttf);
    await createWOFF2(options, ttf);
    await createSvgSymbol(options);

    if (options.css) {
      const styleTemplatePath = options.styleTemplates || (!options.useNameAsUnicode ? path.resolve(__dirname, 'styles') : path.resolve(__dirname, 'ligature-styles'));
      await copyTemplate(styleTemplatePath, options.dist, {
        fontname: options.fontName,
        cssString: cssString.join(''),
        cssToVars: cssToVars.join(''),
        fontSize: fontSize,
        timestamp: new Date().getTime(),
        prefix,
        _opts: typeof options.css === 'boolean' ? {} : { ...options.css }
      });
    }

    if (options.typescript) {
      await createTypescript({ ...options, typescript: options.typescript })
    }

    let jsFileName = options.fontName + '.js';
    let jsPath = path.join(options.dist, jsFileName);
    //Output JS
    let tempJS = `const ${options.fontName} = {${jsString.join(',')}};`;
    fs.outputFileSync(jsPath, tempJS);
    console.log(`${color.green('SUCCESS')} Created ${jsPath} `);

    if (options.outSVGPath) {
      const outPath = await generateIconsSource(options);
      console.log(`${color.green('SUCCESS')} Created ${outPath} `);
    }
    if (options.outSVGReact) {
      const outPath = await generateReactIcons(options);
      console.log(`${color.green('SUCCESS')} Created React Components. `);
    }

  } catch (error) {
    console.log('SvgToFont:CLI:ERR:', error);
  }
}

/**
 * https://github.com/Microsoft/TypeScript/issues/5565#issuecomment-155226290
 */
module.exports = exports["default"];