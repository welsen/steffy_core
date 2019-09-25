import { GlobSync } from 'glob';
import { camelCase, upperFirst } from 'lodash';
import { basename, parse, resolve } from 'path';
import { IInjectable } from '../interfaces';
import { Logger } from "../logger";
import { asyncForEach, registerInjectionToken, useInjectionToken } from '../utils';
import { injector } from './injector';

const mainModuleRoot = (__dirname.split('node_modules')[0].slice(0, -1));

const jsonLoader = async (path: string, type: string, storeIn?: any) => {
  const logger = new Logger();
  logger.log('STEFFI SYSTEM', `loading json [${type}]`);
  const loaded: string[] = [];
  const base = resolve(mainModuleRoot, path);
  const gs = new GlobSync(`${base}/**/*.${type}.json`);
  await asyncForEach(gs.found, async (item: string) => {
    const parsedItem = parse(item); 
    const imported = require(item); // settings.config.json file imported by the compiler
    const symbol = upperFirst(camelCase(basename(parsedItem.name.replace(new RegExp(`\\.${type}$`, 'i'), '')))); // settings.config.json --> Settings
    registerInjectionToken(symbol);
    registerInjectionToken(`${symbol}File`);
    injector.bind<IInjectable>(useInjectionToken(symbol)).toConstantValue(imported);
    injector.bind<string>(useInjectionToken(`${symbol}File`)).toConstantValue(item);
    loaded.push(symbol);
    if (storeIn) {
      storeIn[symbol] = imported; 
    }
  });
  logger.log('STEFFI SYSTEM', `loaded json [${type}]`, loaded);
}

export { jsonLoader }
