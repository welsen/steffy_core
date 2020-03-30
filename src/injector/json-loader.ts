import { watch } from 'chokidar';
import { GlobSync } from 'glob';
import { camelCase, upperFirst } from 'lodash';
import { basename, parse, resolve } from 'path';
import { IInjectable } from '../interfaces';
import { Logger } from '../logger';
import { asyncForEach, registerInjectionToken, useInjectionToken } from '../utils';
import { injector } from './injector';

const mainModuleRoot = __dirname.split('node_modules')[0].slice(0, -1);

const loaderCore = (item: string, type: string, loaded: string[], watcherCall: boolean, storeIn?: any) => {
  const parsedItem = parse(item);
  const imported = require(item); // settings.config.json file imported by the compiler
  const symbol = upperFirst(camelCase(basename(parsedItem.name.replace(new RegExp(`\\.${type}$`, 'i'), '')))); // settings.config.json --> Settings
  if (!watcherCall) {
    registerInjectionToken(symbol);
    registerInjectionToken(`${symbol}File`);
  }
  if (watcherCall) {
    injector.unbind(useInjectionToken(symbol));
    injector.unbind(useInjectionToken(`${symbol}File`));
  }
  // injector.bind<IInjectable>(useInjectionToken(symbol)).toConstantValue(imported);
  injector.bind<IInjectable>(useInjectionToken(symbol)).toConstantValue(imported);
  injector.bind<string>(useInjectionToken(`${symbol}File`)).toConstantValue(item);
  if (!watcherCall) {
    loaded.push(symbol);
    if (storeIn) {
      storeIn[symbol] = imported;
    }
  }
};

const jsonLoader = async (path: string, type: string, storeIn?: any) => {
  const logger = new Logger();
  logger.log('STEFFI SYSTEM', `loading json [${type}]`);
  const loaded: string[] = [];
  const base = resolve(mainModuleRoot, path);
  const jsonGlob = `${base}/**/*${type}.json`;
  const gs = new GlobSync(jsonGlob);
  // const watcher = watch(jsonGlob, {
  //   ignored: /(^|[\/\\])\../, // ignore dotfiles
  //   persistent: true
  // });
  // watcher.on('add', item => {
  //   loaderCore(item, type, loaded, true, storeIn);
  // });
  // watcher.on('change', item => {
  //   loaderCore(item, type, loaded, true, storeIn);
  // });
  await asyncForEach(gs.found, async (item: string) => {
    loaderCore(item, type, loaded, false, storeIn);
  });
  logger.log('STEFFI SYSTEM', `loaded json [${type}]`, loaded);
};

export { jsonLoader };
