- Library that converts 
    - https://github.com/Kitchen-JS/svgtofont
- Font Library output
    - https://github.com/Kitchen-JS/svgtofont-test

<a href="https://github.com/jaywcjlove/svgtofont/">
    Credit to the original and the author jaywcjlove
</a>

## Build
npm run build

## Test
npm run example

### Development

  npm install
  npm update

### Install

  npm init
  
  npm install -g pkg
  
  npm i https://github.com/Kitchen-JS/svgtofont
  
  npm install grunt
  
  For Usage see https://github.com/PEC-Development-Team/PEC-Font-Based-Icons

## Usage

#### Using With Command

```json
{
  "scripts": {
    "font": "svgtofont --sources ./svg --output ./font --fontName uiw-font"
  },
}
```

You can add configuration to package.json. [#48](https://github.com/jaywcjlove/svgtofont/issues/48)

#### Using With Nodejs

```js
const svgtofont = require('svgtofont');
const path = require('path');
 
svgtofont({
  src: path.resolve(process.cwd(), 'icon'), // svg path
  dist: path.resolve(process.cwd(), 'fonts'), // output path
  fontName: 'svgtofont', // font name
  css: true, // Create CSS files.
}).then(() => {
  console.log('done!');
});
```

Or

```js
const svgtofont = require("svgtofont");
const path = require("path");

svgtofont({
  src: path.resolve(process.cwd(), "icon"), // svg path
  dist: path.resolve(process.cwd(), "fonts"), // output path
  styleTemplates: path.resolve(rootPath, "styles"), // file templates path (optional)
  fontName: "svgtofont", // font name
  css: true, // Create CSS files.
  startUnicode: 0xea01, // unicode start number
  svgicons2svgfont: {
    fontHeight: 1000,
    normalize: true
  },
  // website = null, no demo html files
  website: {
    title: "svgtofont",
    // Must be a .svg format image.
    logo: path.resolve(process.cwd(), "svg", "git.svg"),
    version: pkg.version,
    meta: {
      description: "Converts SVG fonts to TTF/EOT/WOFF/WOFF2/SVG format.",
      keywords: "svgtofont,TTF,EOT,WOFF,WOFF2,SVG"
    },
    description: ``,
    // Add a Github corner to your website
    // Like: https://github.com/uiwjs/react-github-corners
    corners: {
      url: 'https://github.com/jaywcjlove/svgtofont',
      width: 62, // default: 60
      height: 62, // default: 60
      bgColor: '#dc3545' // default: '#151513'
    },
    links: [
      {
        title: "GitHub",
        url: "https://github.com/jaywcjlove/svgtofont"
      },
      {
        title: "Feedback",
        url: "https://github.com/jaywcjlove/svgtofont/issues"
      },
      {
        title: "Font Class",
        url: "index.html"
      },
      {
        title: "Unicode",
        url: "unicode.html"
      }
    ],
    footerInfo: `Licensed under MIT. (Yes it's free and <a href="https://github.com/jaywcjlove/svgtofont">open-sourced</a>`
  }
}).then(() => {
  console.log('done!');
});;
```

## API

```js
import { createSVG, createTTF, createEOT, createWOFF, createWOFF2, createSvgSymbol, copyTemplate } from 'svgtofont/lib/utils';

const options = { ... };

async function creatFont() {
  const unicodeObject = await createSVG(options); 
  const ttf = await createTTF(options); // SVG Font => TTF
  await createEOT(options, ttf); // TTF => EOT
  await createWOFF(options, ttf); // TTF => WOFF
  await createWOFF2(options, ttf); // TTF => WOFF2
  await createSvgSymbol(options); // SVG Files => SVG Symbol
}
```

## options

> svgtofont(options)

### dist

> Type: `String`  
> Default value: ~~`dist`~~ => `fonts`  

The output directory.

### outSVGReact

> Type: `Boolean`  
> Default value: `false`  

Output `./dist/react/`, SVG generates `react` components.

```js
git/git.svg

// ↓↓↓↓↓↓↓↓↓↓

import React from 'react';
export const Git = props => (
  <svg viewBox="0 0 20 20" {...props}><path d="M2.6 10.59L8.38 4.8l1.69 -." fillRule="evenodd" /></svg>
);
```

### outSVGPath

> Type: `Boolean`  
> Default value: `false`  

Output `./dist/svgtofont.json`, The content is as follows:

```js
{
  "adobe": ["M14.868 3H23v19L14.868 3zM1 3h8.138L1 22V3zm.182 11.997H13.79l-1.551-3.82H8.447z...."],
  "git": ["M2.6 10.59L8.38 4.8l1.69 1.7c-.24.85.15 1.78.93 2.23v5.54c-.6.34-1 .99-1..."],
  "stylelint": ["M129.74 243.648c28-100.109 27.188-100.5.816c2.65..."]
}
```

Or you can generate the file separately: 

```js
const { generateIconsSource } = require('svgtofont/src/generate');	
const path = require('path');	

async function generate () {	
  const outPath = await generateIconsSource({	
    src: path.resolve(process.cwd(), 'svg'),	
    dist: path.resolve(process.cwd(), 'dist'),	
    fontName: 'svgtofont',	
  });	
}	

generate();
```

### src

> Type: `String`  
> Default value: `svg`  

output path

### emptyDist

> Type: `String`  
> Default value: `false`  

Clear output directory contents

### fontName

> Type: `String`  
> Default value: `iconfont`

The font family name you want.

### styleTemplates

> Type: `String`
> Default value: `undefined`

The path of the templates, see `src/styles` or `test/templates/styles` to get reference about 
  how to create a template, file names can have the extension .template, like a `filename.scss.template`

### startUnicode

> Type: `Number`  
> Default value: `0xea01`  

unicode start number

### useNameAsUnicode

> Type: `Boolean`  
> Default value: `false`  

should the name(file name) be used as unicode? this switch allows for the support of ligatures.

let's say you have an svg with a file name of `add` and you want to use ligatures for it. you would set up your processing as mentioned above and turn on this switch.
```js
{
  ...
  useNameAsUnicode: true
}
```
while processing, instead of using a single sequential char for the unicode, it uses the file name. using the file name as the unicode allows the following code to work as expected.
```css
.icons {
  font-family: 'your-font-icon-name' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```
```html
<i class="icons">add</i>
```
as you add more svgs and process them into your font you would just use the same pattern.
```html
<i class="icons">add</i>
<i class="icons">remove</i>
<i class="icons">edit</i>
```

### classNamePrefix

> Type: `String`  
> Default value: font name  

Create font class name prefix, default value font name.

### css

> Type: `Boolean|CSSOptions`  
> Default value: `false`  

Create CSS/LESS files, default `true`.

```ts
type CSSOptions = {
  /**
   * Output the css file to the specified directory
   */
  output?: string;
  /**
   * Which files are exported.
   */
  include?: RegExp;
  /**
   * Setting font size.
   */
  fontSize?: string;
  /**
   * Set the path in the css file
   * https://github.com/jaywcjlove/svgtofont/issues/48#issuecomment-739547189
   */
  cssPath?: string
  /**
   * Set file name
   * https://github.com/jaywcjlove/svgtofont/issues/48#issuecomment-739547189
   */
  fileName?: string
}
```

### svgicons2svgfont

This is the setting for [svgicons2svgfont](https://github.com/nfroidure/svgicons2svgfont/tree/dd713bea4f97afa59f7dba6a21ff7f22db565bcf#api)


#### svgicons2svgfont.fontName

> Type: `String`  
> Default value: `'iconfont'`  

The font family name you want.

#### svgicons2svgfont.fontId

> Type: `String`  
> Default value: the options.fontName value  

The font id you want.

#### svgicons2svgfont.fontStyle

> Type: `String`  
> Default value: `''`

The font style you want.

#### svgicons2svgfont.fontWeight

> Type: `String`  
> Default value: `''`

The font weight you want.

#### svgicons2svgfont.fixedWidth

> Type: `Boolean`  
> Default value: `false`  

Creates a monospace font of the width of the largest input icon.

#### svgicons2svgfont.centerHorizontally

> Type: `Boolean`  
> Default value: `false`  

Calculate the bounds of a glyph and center it horizontally.

#### svgicons2svgfont.normalize

> Type: `Boolean`  
> Default value: `false`  

Normalize icons by scaling them to the height of the highest icon.

#### svgicons2svgfont.fontHeight

> Type: `Number`  
> Default value: `MAX(icons.height)`  

The outputted font height  (defaults to the height of the highest input icon).

#### svgicons2svgfont.round

> Type: `Number`  
> Default value: `10e12`  

Setup SVG path rounding.

#### svgicons2svgfont.descent

> Type: `Number`  
> Default value: `0`  

The font descent. It is useful to fix the font baseline yourself.

**Warning:**  The descent is a positive value!

#### svgicons2svgfont.ascent

> Type: `Number`  
> Default value: `fontHeight - descent`  

The font ascent. Use this options only if you know what you're doing. A suitable
 value for this is computed for you.

#### svgicons2svgfont.metadata

> Type: `String`  
> Default value: `undefined`  

The font [metadata](http://www.w3.org/TR/SVG/metadata.html). You can set any
 character data in but it is the be suited place for a copyright mention.

#### svgicons2svgfont.log

> Type: `Function`  
> Default value: `console.log`  

Allows you to provide your own logging function. Set to `function(){}` to
 disable logging.

### svgoOptions

> Type: `OptimizeOptions`
> Default value: `undefined` 

Some options can be configured with `svgoOptions` though it. [svgo](https://github.com/svg/svgo#configuration)
### svg2ttf

This is the setting for [svg2ttf](https://github.com/fontello/svg2ttf/tree/c33a126920f46b030e8ce960cc7a0e38a6946bbc#svg2ttfsvgfontstring-options---buf)

#### svg2ttf.copyright

> Type: `String`

copyright string

#### svg2ttf.ts

> Type: `String`

Unix timestamp (in seconds) to override creation time 

#### svg2ttf.version

> Type: `Number`

font version string, can be Version `x.y` or `x.y`.

### website

Define preview web content. Example: 

```js
{
  ...
  // website = null, no demo html files
  website: {
    title: "svgtofont",
    logo: path.resolve(process.cwd(), "svg", "git.svg"),
    version: pkg.version,
    meta: {
      description: "Converts SVG fonts to TTF/EOT/WOFF/WOFF2/SVG format.",
      keywords: "svgtofont,TTF,EOT,WOFF,WOFF2,SVG",
      favicon: "./favicon.png"
    },
    // Add a Github corner to your website
    // Like: https://github.com/uiwjs/react-github-corners
    corners: {
      url: 'https://github.com/jaywcjlove/svgtofont',
      width: 62, // default: 60
      height: 62, // default: 60
      bgColor: '#dc3545' // default: '#151513'
    },
    links: [
      {
        title: "GitHub",
        url: "https://github.com/jaywcjlove/svgtofont"
      },
      {
        title: "Feedback",
        url: "https://github.com/jaywcjlove/svgtofont/issues"
      },
      {
        title: "Font Class",
        url: "index.html"
      },
      {
        title: "Unicode",
        url: "unicode.html"
      }
    ]
  }
}
```

#### website.template

> Type: `String`  
> Default value: [index.ejs](src/website/index.ejs)  

Custom template can customize parameters. You can define your own template based on the [default template](src/website/index.ejs).

```js
{
  website: {
    template: path.join(process.cwd(), "my-template.ejs")
  }
}
```
#### website.index

> Type: `String`  
> Default value: `font-class`, Enum{`font-class`, `unicode`, `symbol`}  

Set default home page.

## Font Usage

Suppose the font name is defined as `svgtofont`, The default home page is `unicode`, Will generate: 

```bash
font-class.html
index.html
svgtofont.css
svgtofont.eot
svgtofont.json
svgtofont.less
svgtofont.module.less
svgtofont.scss
svgtofont.styl
svgtofont.svg
svgtofont.symbol.svg
svgtofont.ttf
svgtofont.woff
svgtofont.woff2
symbol.html
```

Preview demo `font-class.html`, `symbol.html` and `index.html`. Automatically generated style `svgtofont.css` and `svgtofont.less`.

### symbol svg

```xml
<svg class="icon" aria-hidden="true">
  <use xlink:href="svgtofont.symbol.svg#svgtofont-git"></use>
</svg>
```

### Unicode

```html
<style>
.iconfont {
  font-family: "svgtofont-iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
</style>
<span class="iconfont">&#59907;</span>
```

### Class Name

Support for `.less` and `.css` styles references.

```html
<link rel="stylesheet" type="text/css" href="node_modules/fonts/svgtofont.css">
<i class="svgtofont-apple"></i>
```

### Using With React

#### In the project created by [create-react-app](https://github.com/facebook/create-react-app)

```jsx
import logo from './logo.svg';

<img src={logo}  />
```

```jsx
import { ReactComponent as ComLogo } from './logo.svg';

<ComLogo />
```

#### In the project created by [webpack](https://github.com/webpack/webpack)

```bash
yarn add babel-plugin-named-asset-import
yarn add @svgr/webpack
```

```js
// webpack.config.js
[
  require.resolve('babel-plugin-named-asset-import'),
  {
    loaderMap: {
      svg: {
        ReactComponent: '@svgr/webpack?-svgo,+ref![path]',
      },
    },
  },
],
```

```jsx
import { ReactComponent as ComLogo } from './logo.svg';

<ComLogo />
```

## License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).
