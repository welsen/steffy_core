import { storage } from '@steffy/di';
import { GlobSync } from 'glob';
import { camelCase, upperFirst } from 'lodash';
import { basename, parse, resolve } from 'path';
import { asyncForEach } from '../utils';

let mainModuleRoot: string = `${__dirname}/../../example`; // for example
if (__dirname.includes('node_modules')) mainModuleRoot = __dirname.split('node_modules')[0].slice(0, -1);

const loaderCore = (item: string, type: string) => {
  const parsedItem = parse(item);
  const imported = require(item); // settings.config.json file imported by the compiler
  const symbol = upperFirst(camelCase(basename(parsedItem.name.replace(new RegExp(`\\.${type}$`, 'i'), '')))); // settings.config.json --> Settings
  storage.storeStatic(symbol, imported);
};

const jsonLoader = async (path: string, type: string, storeIn?: any) => {
  const base = resolve(mainModuleRoot, path);
  const jsonGlob = `${base}/**/*${type}.json`;
  const gs = new GlobSync(jsonGlob);
  await asyncForEach(gs.found, async (item: string) => {
    loaderCore(item, type);
  });
};

export { jsonLoader };
