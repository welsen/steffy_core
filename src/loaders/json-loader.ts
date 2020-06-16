import { GlobSync } from 'glob';
import { camelCase, upperFirst } from 'lodash';
import { basename, parse, resolve } from 'path';
import { Logger } from '../logger';
import { asyncForEach } from '../utils';
import storage from '../di/storage';

let mainModuleRoot: string = `${__dirname}/../../example`; // for example
if (__dirname.includes('node_modules')) mainModuleRoot = __dirname.split('node_modules')[0].slice(0, -1);

const loaderCore = (item: string, type: string) => {
  const parsedItem = parse(item);
  const imported = require(item); // settings.config.json file imported by the compiler
  const symbol = upperFirst(camelCase(basename(parsedItem.name.replace(new RegExp(`\\.${type}$`, 'i'), '')))); // settings.config.json --> Settings
  console.log(symbol, imported);
  storage.storeStatic(symbol, imported);
  // if (!watcherCall) {
  //   registerInjectionToken(symbol);
  //   registerInjectionToken(`${symbol}File`);
  // }
  // if (watcherCall) {
  //   injector.unbind(useInjectionToken(symbol));
  //   injector.unbind(useInjectionToken(`${symbol}File`));
  // }
  // // injector.bind<IInjectable>(useInjectionToken(symbol)).toConstantValue(imported);
  // injector.bind<IInjectable>(useInjectionToken(symbol)).toConstantValue(imported);
  // injector.bind<string>(useInjectionToken(`${symbol}File`)).toConstantValue(item);
  // if (!watcherCall) {
  //   loaded.push(symbol);
  //   if (storeIn) {
  //     storeIn[symbol] = imported;
  //   }
  // }
};

const jsonLoader = async (path: string, type: string, storeIn?: any) => {
  const logger = new Logger();
  logger.log('STEFFY SYSTEM', `loading json [${type}]`);
  const loaded: string[] = [];
  const base = resolve(mainModuleRoot, path);
  const jsonGlob = `${base}/**/*${type}.json`;
  const gs = new GlobSync(jsonGlob);
  await asyncForEach(gs.found, async (item: string) => {
    loaderCore(item, type);
  });
  logger.log('STEFFY SYSTEM', `loaded json [${type}]`);
};

export { jsonLoader };
