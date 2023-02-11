import fs from 'fs-extra';
import path from 'path';
import svgtofont from '../src';
import pkg from '../package.json';

console.log = jest.fn();

it('example test case.', async () => {
  const dist = path.resolve(process.cwd(), 'test', 'example', 'dist');
  await fs.emptyDir(dist);
  await svgtofont({
    src: path.resolve(process.cwd(), 'test', 'example', 'svg'),
    dist: dist,
    fontName: "svgtofont", // font name
    css: true, // Create CSS files.
    outSVGReact: true,
    outSVGPath: true,
    svgicons2svgfont: {
      fontHeight: 1000,
      normalize: true
    },
    typescript: true,
    website: null
  });
  const fileNames = await fs.readdir(dist);
  expect(fileNames).toEqual([
    'react',
    'svgtofont.css',
    'svgtofont.d.ts',
    'svgtofont.eot',
    'svgtofont.json',
    'svgtofont.less',
    'svgtofont.module.less',
    'svgtofont.scss',
    'svgtofont.styl',
    'svgtofont.svg',
    'svgtofont.symbol.svg',
    'svgtofont.ttf',
    'svgtofont.woff',
    'svgtofont.woff2'
  ]);
  await fs.emptyDir(dist);
});

it('example simple test case.', async () => {
  const dist = path.resolve(process.cwd(), 'test', 'example', 'dist');
  await fs.emptyDir(dist);
  await svgtofont({
    src: path.resolve(process.cwd(), 'test', 'example', 'svg'),
    dist: dist,
    fontName: 'svgtofont',
    css: false,
    emptyDist: true,
    typescript: true,
  });
  const fileNames = await fs.readdir(dist);
  expect(fileNames).toEqual([
    'svgtofont.css',
    'svgtofont.d.ts',
    'svgtofont.eot',
    'svgtofont.less',
    'svgtofont.module.less',
    'svgtofont.scss',
    'svgtofont.styl',
    'svgtofont.svg',
    'svgtofont.symbol.svg',
    'svgtofont.ttf',
    'svgtofont.woff',
    'svgtofont.woff2',
  ]);
  await fs.emptyDir(dist);
});

it('templates simple test case.', async () => {
  const dist = path.resolve(process.cwd(), 'test', 'templates', 'dist');
  await fs.emptyDir(dist);
  await svgtofont({
    src: path.resolve(process.cwd(), 'test', 'templates', 'svg'),
    dist: dist,
    styleTemplates: path.resolve(process.cwd(), 'test', 'templates', 'styles'),
    fontName: 'svgtofont',
    emptyDist: true,
  });
  const fileNames = await fs.readdir(dist);
  expect(fileNames).toEqual([
    'svgtofont.css',
    'svgtofont.eot',
    'svgtofont.less',
    'svgtofont.module.less',
    'svgtofont.scss',
    'svgtofont.styl',
    'svgtofont.svg',
    'svgtofont.symbol.svg',
    'svgtofont.ttf',
    'svgtofont.woff',
    'svgtofont.woff2',
  ]);
  const css = await fs.readFile(path.resolve(dist, 'svgtofont.css'));
  expect(css.toString().indexOf('Hello CSS!') > -1).toBeTruthy();
  await fs.emptyDir(dist);
});
 
it('example simple test case for useNameAsUnicode.', async () => {
  const dist = path.resolve(process.cwd(), 'test', 'example', 'dist');
  await fs.emptyDir(dist);
  await svgtofont({
    src: path.resolve(process.cwd(), 'test', 'example', 'svg'),
    dist: dist,
    fontName: 'nameAsUnicode',
    css: false,
    classNamePrefix: 'my-icons',
    useNameAsUnicode: true,
    emptyDist: true,
    typescript: true,
  });
  const fileNames = await fs.readdir(dist);
  expect(fileNames).toEqual([
    'nameAsUnicode.css',
    'nameAsUnicode.d.ts',
    'nameAsUnicode.eot',
    'nameAsUnicode.less',
    'nameAsUnicode.module.less',
    'nameAsUnicode.scss',
    'nameAsUnicode.styl',
    'nameAsUnicode.svg',
    'nameAsUnicode.symbol.svg',
    'nameAsUnicode.ttf',
    'nameAsUnicode.woff',
    'nameAsUnicode.woff2',
  ]);
  const css = await fs.readFile(path.resolve(dist, 'nameAsUnicode.css'));
  // should contain a class with the prefix or the font name, in this case we provided a prefix so we should get that
  expect(css.toString().indexOf('.my-icons') > -1).toBeTruthy();
  // should not contain any variables
  expect(css.toString().indexOf('$') === -1).toBeTruthy();
  await fs.emptyDir(dist);
});