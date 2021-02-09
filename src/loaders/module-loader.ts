import { GlobSync } from 'glob';
import { resolve } from 'path';
import { asyncForEach } from '../utils';

let mainModuleRoot: string = `${__dirname}/../../example`; // for example
if (__dirname.includes('node_modules')) mainModuleRoot = __dirname.split('node_modules')[0].slice(0, -1);

const moduleLoader = async (path: string, type: string) => {
  const base = resolve(mainModuleRoot, path);
  const tsGlob = `${base}/**/*${type}.ts`;
  const gs = new GlobSync(tsGlob);
  await asyncForEach(gs.found, async (item: string) => {
    await import(item);
  });
};

export { moduleLoader };
