/// <reference types="./types" />
import { SVGIcons2SVGFontOptions } from 'svgicons2svgfont';
import { OptimizeOptions } from 'svgo';
import { CSSOptions, TypescriptOptions } from './utils';
export declare type SvgToFontOptions = {
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
    website?: {
        /**
         * Add a Github corner to your website
         * @like https://github.com/uiwjs/react-github-corners
         */
        corners?: {
            /**
             * @example `https://github.com/jaywcjlove/svgtofont`
             */
            url?: string;
            /**
             * @default 60
             */
            width?: number;
            /**
             * @default 60
             */
            height?: number;
            /**
             * @default #151513
             */
            bgColor?: '#dc3545';
        };
        /**
         * @default unicode
         */
        index?: 'font-class' | 'unicode' | 'symbol';
        /**
         * website title
         */
        title?: string;
        /**
         * @example
         * ```js
         * path.resolve(rootPath, "favicon.png")
         * ```
         */
        favicon?: string;
        /**
         * Must be a .svg format image.
         * @example
         * ```js
         * path.resolve(rootPath, "svg", "git.svg")
         * ```
         */
        logo?: string;
        version?: string;
        meta?: {
            description?: string;
            keywords?: string;
        };
        description?: string;
        template?: string;
        footerInfo?: string;
        links: Array<{
            title: string;
            url: string;
        }>;
    };
    /**
     * Create typescript file with declarations for icon classnames
     * @default false
     */
    typescript?: boolean | TypescriptOptions;
};
declare const _default: (options?: SvgToFontOptions) => Promise<void>;
export default _default;
