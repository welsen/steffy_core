import { GlobSync } from 'glob';
import { camelCase, upperFirst } from 'lodash';
import { basename, parse, resolve } from 'path';
import { IInjectable } from '../interfaces';
import { Logger } from "../logger";
import { asyncForEach, registerInjectionToken, useInjectionToken } from '../utils';
import { injector } from './injector';

const mainModuleRoot = (__dirname.split('node_modules')[0].slice(0, -1));

const moduleLoader = async (path: string, type: string, asSingleton: boolean = false, storeIn?: any) => {
  const logger = new Logger();
  logger.log('STEFFI SYSTEM', `loading modules [${type}]`);
  const loaded: string[] = [];
  const base = resolve(mainModuleRoot, path);
  const gs = new GlobSync(`${base}/**/*${type}.ts`);
  await asyncForEach(gs.found, async (item: string) => {
    const parsedItem = parse(item); 
    const imported = await import(item); // http-server.plugin.ts file imported by the compiler
    const symbol = upperFirst(camelCase(basename(parsedItem.name))); // http-server.plugin.ts --> HttpServerPlugin
    const ctor = imported[symbol]; // class HttpServerPlugin contructor
    registerInjectionToken(symbol);
    if (!asSingleton) {
      injector.bind<IInjectable>(useInjectionToken(symbol)).to(ctor); // new HttpServerPlugin()
    } else {
      injector.bind<IInjectable>(useInjectionToken(symbol)).to(ctor).inSingletonScope(); // new HttpServerPlugin() as singleton
    }
    loaded.push(symbol);
    if (storeIn) {
      storeIn[symbol] = ctor; 
    }
  });
  logger.log('STEFFI SYSTEM', `loaded modules [${type}]`, loaded);
}

export { moduleLoader }